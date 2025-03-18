export class Base64 {
  public static async encode(input: any) {
    return Buffer.from(JSON.stringify(input)).toString('base64');
  }
  public static async decode(input: any) {
    return JSON.parse(Buffer.from(input, 'base64').toString());
  }
}
