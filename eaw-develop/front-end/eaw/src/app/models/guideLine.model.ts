/**
 * GuideLine model
 */
export class GuideLine {
  public id: number;
  public name: string;
  public numberGuidelines: string;
  public referenceLink: string;
  public principleId: number;

  /**
   * GuideLine model constructor
   * @param { number } id
   * @param { string } name
   * @param { string } numberGuidelines
   * @param { string } referenceLink
   * @param { number } principleId
   */
  constructor(
    id: number = 0,
    name: string,
    numberGuidelines: string,
    referenceLink: string,
    principleId: number,
  ) {
    this.id = id;
    this.name = name;
    this.numberGuidelines = numberGuidelines;
    this.referenceLink = referenceLink;
    this.principleId = principleId;
  }
}
