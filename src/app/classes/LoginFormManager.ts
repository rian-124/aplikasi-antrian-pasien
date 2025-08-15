import { FormField } from './FormField';

export class LoginFormManager {
  private fields: FormField[];

  constructor() {
    this.fields = [
      new FormField("Username", "username", "text", "Enter your username"),
      new FormField("Password", "password", "password", "Enter your password"),
    ];
  }

  getFields(): FormField[] {
    return this.fields;
  }
}
