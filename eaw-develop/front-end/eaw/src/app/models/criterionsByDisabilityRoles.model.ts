/**
 * CriterionsByDisabilityRoles model
 */
export class CriterionsByDisabilityRoles {
  public disabilitiesId: number;
  public criterionsId: number;

  /**
   * CriterionsByDisabilityRoles model constructor
   * @param { number } disabilitiesId
   * @param { number } criterionsId
   */
  constructor(disabilitiesId: number, criterionsId: number) {
    this.disabilitiesId = disabilitiesId;
    this.criterionsId = criterionsId;
  }
}
