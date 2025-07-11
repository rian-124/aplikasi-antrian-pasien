import { FormField } from './FormField';

export class LoginFormManager {
  fields: FormField[];

  constructor() {
    this.fields = [
      new FormField('Email', 'email', 'email', 'Type email address'),
      new FormField('Password', 'password', 'password', 'Password')
    ];
  }

  getFields(): FormField[] {
    return this.fields;
  }
}
