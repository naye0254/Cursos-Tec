/**
 * Languages model
 */
export class Languages {
  public id: number;
  public name: string;
  public iana: string;

  /**
   * Languages model constructor
   * @param { number } id
   * @param { string } name
   * @param { string } iana
   */
  constructor(id: number = 0, name: string, iana: string = null) {
    this.id = id;
    this.name = name;
    this.iana = iana;
  }
}
