/**
 * Segments model
 */
export class Segments {
  public id: number;
  public name: string;
  public isActive: number;
  public countriesId: number;
  public createdBy: number;
  public createdAt: Date;
  public updatedBy: number;
  public updatedAt: Date;

  /**
   * Segments model constructor
   * @param { number } id
   * @param { string } name
   * @param { number } createdBy
   * @param { Date } createdAt
   * @param { number } isActive
   * @param { number } countriesId
   */
  constructor(
    id: number = 0,
    name: string = null,
    createdBy: number = null,
    createdAt: Date = null,
    isActive: number = 1,
    countriesId: number = null,
  ) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.countriesId = countriesId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}
