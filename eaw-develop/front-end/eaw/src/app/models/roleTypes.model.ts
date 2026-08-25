/**
 * RoleTypes model
 */
export class RoleTypes {
  public id: number;
  public roleType: string;

  /**
   * RoleTypes model constructor
   * @param { number } id
   * @param { string } roleType
   */
  constructor(id: number = 0, roleType: string = null) {
    this.id = id;
    this.roleType = roleType;
  }
}
