type ConfigType = 'niri' | 'hyprland';

class ParseObject {
  public keys: string[];
  public title: string;
  public action: string;
  public entity?: string;
  public type: ConfigType;

  constructor(
    keys: string[],
    title: string,
    action: string,
    type: ConfigType,
    entity?: string,
  ) {
    this.keys = keys;
    this.title = title;
    this.action = action;
    this.entity = entity;
    this.type = type;
  }

  parse() {
    const keys_list: string = this.keys.join('+');
    return `${keys_list} hotkey-overlay-title="${this.title}" { ${this.action}: ${this.entity} }`;
  }
}
