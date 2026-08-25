/**
 * DisabilitiesByUsers model
 */
export class DisabilitiesByUsers {
  public usersId: number;
  public disabilitiesId: number;

  /**
   * DisabilitiesByUsers model constructor
   * @param { number } usersId
   * @param { number } disabilitiesId
   */
  constructor(usersId: number, disabilitiesId: number) {
    this.usersId = usersId;
    this.disabilitiesId = disabilitiesId;
  }
}
