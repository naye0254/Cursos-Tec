/**
 * Country model
 */
export class Country {
  public id: number;
  public name: string;
  public prefix: string;
  public countryName: string;

  /**
   * Country model constructor
   * @param { number } id
   * @param { string } name
   * @param { string } prefix
   * @param { string } countryName
   */
  constructor(
    id: number = 0,
    name: string,
    prefix: string,
    countryName: string,
  ) {
    this.id = id;
    this.name = name;
    this.prefix = prefix;
    this.countryName = countryName;
  }
}
