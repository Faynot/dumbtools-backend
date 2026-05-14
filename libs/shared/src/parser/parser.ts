type ConfigType = 'niri' | 'hyprland';

type ParseInput = {
  keys: string[];
  action: string;
  title?: string;
  entity?: string;
};

type Formatter = (input: ParseInput) => string;

const formatters: Record<ConfigType, Formatter> = {
  niri: ({ keys, action, title, entity }): string => {
    const keysList = (keys ?? []).join('+');
    const entityPart = entity ? ` ${entity}` : '';
    const titlePart = title ? ` hotkey-overlay-title="${title}"` : '';

    return `    ${keysList}${titlePart} { ${action}${entityPart}; }`;
  },

  hyprland: ({ keys, action, entity }): string => {
    const keysList = (keys ?? []).join(', ');
    const actionParts = [action, entity].filter(Boolean).join(', ');

    return `bind = ${keysList}, ${actionParts}`;
  },
};

export class ParseObject {
  constructor(
    public type: ConfigType,
    public input: ParseInput,
  ) {}

  static parseMany(content: string): ParseObject[] {
    const results: ParseObject[] = [];

    // Niri parsing
    const niriBlockMatch = content.match(/binds\s*\{([\s\S]*?)\n\}/);
    if (niriBlockMatch?.[1]) {
      const blockContent = niriBlockMatch[1];
      const niriRegex =
        /^\s*([^\s{]+)(?:\s+([^{]+))?\s*\{\s*([^\s;]+)(?:\s+([^;}]*))?\s*;?\s*\}/gm;

      let match: RegExpExecArray | null;
      while ((match = niriRegex.exec(blockContent)) !== null) {
        const [, keys, attrs, action, entity] = match;

        const titleMatch = attrs?.match(/hotkey-overlay-title="([^"]+)"/);

        results.push(
          new ParseObject('niri', {
            keys: keys.split('+'),
            action: action.trim(),
            entity: entity?.trim() || undefined,
            title: titleMatch ? titleMatch[1] : undefined,
          }),
        );
      }
    }

    // Hyprland parsing
    const hyprRegex =
      /^bind\s*=\s*([^,]+),\s*([^,]+),\s*([^,]+)(?:,\s*(.*))?$/gm;
    let hMatch: RegExpExecArray | null;
    while ((hMatch = hyprRegex.exec(content)) !== null) {
      results.push(
        new ParseObject('hyprland', {
          keys: [hMatch[1].trim(), hMatch[2].trim()],
          action: hMatch[3].trim(),
          entity: hMatch[4]?.trim() || undefined,
        }),
      );
    }

    return results;
  }

  static parse(line: string): ParseObject {
    const results = this.parseMany(line);
    if (results.length === 0) throw new Error('Could not parse bind');
    return results[0];
  }

  genconf(file: string): string {
    const formatter: Formatter | undefined = formatters[this.type];
    if (!formatter) throw new Error(`Unsupported config type: ${this.type}`);

    const bind = formatter(this.input);
    return insertAfter(
      file,
      this.type === 'niri' ? 'binds {' : '',
      bind,
      this.type,
    );
  }
}

const insertAfter = (
  str: string,
  keyword: string,
  insert: string,
  type: ConfigType,
): string => {
  if (type === 'hyprland') {
    const hasNewline = str.endsWith('\n');
    return `${str}${hasNewline ? '' : '\n'}${insert}\n`;
  }

  const index = str.indexOf(keyword);
  if (index === -1) {
    return `${str}\n\nbinds {\n${insert}\n}\n`;
  }

  const insertionPoint = index + keyword.length;
  return (
    str.slice(0, insertionPoint) + '\n' + insert + str.slice(insertionPoint)
  );
};
