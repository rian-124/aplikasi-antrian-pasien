export class User {
    constructor(
        public id: number,
        public email: string,
        public name: string,
        public outlet_id: number,
        public role_id: number
    ) {}
}