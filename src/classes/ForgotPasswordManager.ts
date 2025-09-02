export class ForgotPasswordField {
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

export class ForgotPasswordManager {
  private field: ForgotPasswordField;

  constructor() {
    this.field = new ForgotPasswordField(
      'Username',        
      'username',       
      'text',           
      'Enter your username'
    );
  }

  getField(): ForgotPasswordField {
    return this.field;
  }
}
