/**
 * Tags model
 */
export class Tags {
  public id: number;
  public name: string;
  public createdBy: number;
  public createdAt: Date;
  public updatedBy: number;
  public updatedAt: Date;

  /**
   * Tags model constructor
   * @param { number } id
   * @param { string } name
   * @param { number } createdBy
   * @param { Date } createdAt
   */
  constructor(
    id: number = 0,
    name: string,
    createdBy: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}
