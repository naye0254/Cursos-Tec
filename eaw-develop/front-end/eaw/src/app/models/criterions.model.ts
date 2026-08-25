/**
 * Criterions model
 */
export class Criterions {
  public id: number;
  public numberCriterion: string;
  public name: string;
  public referenceLink: string;
  public guidelinesId: number;
  public level: string;
  public criterionDescription: string;
  public isActive: number;
  public createdBy: number;
  public createdAt: Date;
  public updatedBy: number;
  public updatedAt: Date;
  /**
   * Criterions model constructor
   * @param { number } id
   * @param { string } numberCriterion
   * @param { string } name
   * @param { string } referenceLink
   * @param { number } guidelinesId
   * @param { string } level
   * @param { string } criterionDescription
   * @param { number } createdBy
   * @param { Date } createdAt
   * @param { number } isActive
   */
  constructor(
    id: number = 0,
    numberCriterion: string = null,
    name: string = null,
    referenceLink: string = null,
    guidelinesId: number = null,
    level: string = null,
    criterionDescription: string = null,
    createdBy: number = null,
    createdAt: Date = null,
    isActive: number = 1,
  ) {
    this.id = id;
    this.numberCriterion = numberCriterion;
    this.name = name;
    this.referenceLink = referenceLink;
    this.guidelinesId = guidelinesId;
    this.level = level;
    this.criterionDescription = criterionDescription;
    this.isActive = isActive;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}
