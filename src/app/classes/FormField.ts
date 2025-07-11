export class FormField {
  label: string;
  type: string;
  placeholder: string;
  name: string;

  constructor(label: string, name: string, type: string, placeholder: string) {
    this.label = label;
    this.name = name;
    this.type = type;
    this.placeholder = placeholder;
  }
}
