/**
 * Rules model
 */
export class Rules {
  public id: number;
  public ruleName: string;
  public description: string;

  /**
   * Rules model constructor
   * @param { number } id
   * @param { string } ruleName
   * @param { string } description
   */
  constructor(id: number = 0, ruleName: string, description: string = null) {
    this.id = id;
    this.ruleName = ruleName;
    this.description = description;
  }
}
