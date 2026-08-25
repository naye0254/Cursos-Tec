/**
 * Principles model
 */
export class Principles {
  public id: number;
  public name: string;
  public referenceLink: string;

  /**
   * Principles model constructor
   * @param { number } id
   * @param { string } name
   * @param { string } referenceLink
   */
  constructor(id: number = 0, name: string, referenceLink: string = null) {
    this.id = id;
    this.name = name;
    this.referenceLink = referenceLink;
  }
}
