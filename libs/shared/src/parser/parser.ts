type ConfigType = 'niri' | 'hyprland';

type ParseInput = {
  keys: string[];
  action: string;
  title?: string;
  entity?: string;
};

type Formatter = (input: ParseInput) => string;

const formatters: Record<ConfigType, Formatter> = {
  niri: ({ keys, action, title, entity }) => {
    const keysList = (keys ?? []).join('+');
    const entityPart = entity ? `: ${entity}` : '';
    const titlePart = title ? ` hotkey-overlay-title="${title}"` : '';

    return `${keysList}${titlePart} { ${action}${entityPart} }`;
  },

  hyprland: ({ keys, action, entity }) => {
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

  genconf(file: string): string {
    const formatter = formatters[this.type];

    if (!formatter) {
      throw new Error(`Unsupported config type: ${this.type}`);
    }

    const bind = formatter(this.input);

    const config: string = insertAfter(
      file,
      `bind${this.type === 'niri' ? 's {' : ''}`,
      `\n${bind}\n`,
      this.type,
    );

    return config;
  }
}

const insertAfter = (str, keyword, insert, type) => {
  const index = str.indexOf(keyword);
  if (index === -1) return str;

  return type === 'hyprland'
    ? str + insert
    : str.slice(0, index + keyword.length) +
        insert +
        str.slice(index + keyword.length);
};
