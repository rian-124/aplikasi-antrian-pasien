export class Stat {
  title: string;
  value: number;
  icon: string;
  color: string; 

  constructor(title: string, value: number, icon: string, color: string) {
    this.title = title;
    this.value = value;
    this.icon = icon;
    this.color = color;
  }
}
