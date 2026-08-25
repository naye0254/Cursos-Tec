/**
 * SupportTools model
 */
export class SupportTools {
  public id: number;
  public name: string;
  public version: string;
  public isActive: boolean;
  public createdBy: number;
  public createdAt: Date;
  public updatedBy: number;
  public updatedAt: Date;

  public isActiveLabel: string;
  public disabilitiesString: string;
  public disabilities: [];

  /**
   * SupportTools model constructor
   * @param { number } id
   * @param { string } name
   * @param { string } version
   * @param { number } createdBy
   * @param { Date } createdAt
   * @param { number } isActive
   */
  constructor(
    id: number = 0,
    name: string = null,
    version: string = null,
    createdBy: number = null,
    createdAt: Date = null,
    isActive: boolean = true,
    disabilities: [],
    disabilitiesString: string = '',
    isActiveLabel: string = '',
  ) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.isActive = isActive;
    this.disabilities = disabilities;
    this.disabilitiesString = disabilitiesString;
    this.isActiveLabel = isActiveLabel;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}
