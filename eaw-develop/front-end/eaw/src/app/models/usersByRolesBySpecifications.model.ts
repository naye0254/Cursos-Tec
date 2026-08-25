/**
 * UsersByRolesBySpecifications model
 */
export class UsersByRolesBySpecifications {
  public id: number;
  public usersId: number;
  public specificationsId: number;
  public disabilitiesId: number;

  /**
   * UsersByRolesBySpecifications model constructor
   * @param { number } id
   * @param { number } usersId
   * @param { number } specificationsId
   * @param { number } disabilitiesId
   */
  constructor(
    id: number,
    usersId: number,
    specificationsId: number,
    disabilitiesId: number,
  ) {
    this.id = id;
    this.usersId = usersId;
    this.specificationsId = specificationsId;
    this.disabilitiesId = disabilitiesId;
  }
}
