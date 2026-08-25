/**
 * Disabilities model
 */
export class Disabilities {
  public id: number;
  public name: string;
  public isActive: number;
  public createdBy: number;
  public createdAt: Date;
  public updatedBy: number;
  public updatedAt: Date;

  /**
   * Disabilities model constructor
   * @param { number } id
   * @param { string } name
   * @param { number } createdBy
   * @param { Date } createdAt
   * @param { number } isActive
   */
  constructor(
    id: number = 0,
    name: string = null,
    createdBy: number,
    createdAt: Date,
    isActive: number = 1,
  ) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}
