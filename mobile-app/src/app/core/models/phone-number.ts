export class PhoneNumber {
  country: string;
  line: string;

  get e164() {
    const num = this.country + this.line;
    return `+${num}`;
  }

}
