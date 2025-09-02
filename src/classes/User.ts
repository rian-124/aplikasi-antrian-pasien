export class User {
  constructor(
    public id: number,
    public username: string,
    public name: string,
    public outlet_id: number,
    public outlet_name: string,
    public role_id: number,
    public loket_id?: number | null,
    public lokets?: {
      id: number;
      nama_loket: string;
      outlet_id: number;
      created_At: string;
      update_At: string;
    }
  ) {}
}