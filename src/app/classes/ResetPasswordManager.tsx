export class ResetPasswordField {
    label: string;
    name: string;
    type: string;
    placeholder: string;

    constructor(label: string, name: string, type: string, placeholder: string) {
        this.label = label;
        this.name = name;
        this.type = type;
        this.placeholder = placeholder;
    }
}

export class ResetPasswordManager {
    private fields: ResetPasswordField[];

    constructor() {
        this.fields = [
            new ResetPasswordField('New Password', 'newPassword', 'password', 'Type your new password'),
            new ResetPasswordField('Confirm Passwowrd', 'confirmPassword', 'password', 'Retype yout new password'),
        ];
    }

    getFields(): ResetPasswordField[] {
        return this.fields;
    }
}