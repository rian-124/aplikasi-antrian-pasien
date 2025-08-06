import { FormField } from './FormField';

export class LoginFormManager {
  private fields: FormField[];

  constructor() {
    this.fields = [
      new FormField("Email", "email", "email", "Enter your email"),
      new FormField("Password", "password", "password", "Enter your password"),
    ];
  }

  getFields(): FormField[] {
    return this.fields;
  }
}
