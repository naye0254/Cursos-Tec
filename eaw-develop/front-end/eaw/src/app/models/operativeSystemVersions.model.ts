/**
 * OperativeSystemVersions model
 */
export class OperativeSystemVersions {
  public id: number;
  public name: string;
  public operativeSystemsId: number;

  /**
   * OperativeSystemVersions model constructor
   * @param { number } id
   * @param { string } name
   * @param { number } operativeSystemsId
   */
  constructor(id: number = 0, name: string, operativeSystemsId: number = null) {
    this.id = id;
    this.name = name;
    this.operativeSystemsId = operativeSystemsId;
  }
}
