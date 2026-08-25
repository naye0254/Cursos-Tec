/**
 * Devices model
 */
export class Devices {
  public id: number;
  public name: string;
  public brand: string;
  public version: string;
  public operativeSystemId: number;
  public isActive: number;
  public operativeSystemLabel: string;

  public createdBy: number;
  public createdAt: Date;
  public updatedBy: number;
  public updatedAt: Date;
  /**
   * Devices model constructor
   * @param { number } id
   * @param { string } name
   * @param { string } brand
   * @param { string } version
   * @param { string } operativeSystemLabel
   * @param { number } operativeSystemId
   * @param { number } createdBy
   * @param { Date } createdAt
   * @param { number } isActive
   */
  constructor(
    id: number = 0,
    name: string = null,
    brand: string = null,
    version: string = null,
    operativeSystemLabel: string = null,
    operativeSystemId: number = null,
    createdBy: number,
    createdAt: Date,
    isActive: number = 1,
  ) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.version = version;
    this.operativeSystemId = operativeSystemId;
    this.operativeSystemLabel = operativeSystemLabel;
    this.isActive = isActive;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}
