/**
 * Browsers model
 */
export class Browsers {
  public id: number;
  public name: string;
  public browserVersion: string;
  public isActive: number;
  public createdBy: number;
  public createdAt: Date;
  public updatedBy: number;
  public updatedAt: Date;

  /**
   * Browsers model constructor
   * @param { number } id
   * @param { string } name
   * @param { string } browserVersion
   * @param { number } createdBy
   * @param { Date } createdAt
   * @param { number } isActive
   */
  constructor(
    id: number = 0,
    name: string = null,
    browserVersion: string = null,
    createdBy: number,
    createdAt: Date,
    isActive: number = 1,
  ) {
    this.id = id;
    this.name = name;
    this.browserVersion = browserVersion;
    this.isActive = isActive;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}
