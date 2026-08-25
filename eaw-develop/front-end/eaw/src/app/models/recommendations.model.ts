/**
 * Recommendations model
 */
export class Recommendations {
  public id: number;
  public criterionsId: number;
  public descriptionRecommendation: string;
  public alternativeRecomendationCode: string;

  /**
   * Recommendations model constructor
   * @param { number } id
   * @param { number } criterionsId
   * @param { string } descriptionRecommendation
   * @param { string } alternativeRecomendationCode
   */
  constructor(
    id: number,
    criterionsId: number,
    descriptionRecommendation: string = null,
    alternativeRecomendationCode: string = null,
  ) {
    this.id = id;
    this.criterionsId = criterionsId;
    this.descriptionRecommendation = descriptionRecommendation;
    this.alternativeRecomendationCode = alternativeRecomendationCode;
  }
}
