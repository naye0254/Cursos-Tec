/**
 * OperativeSystemsByDevices model
 */
export class OperativeSystemsByDevices {
  public devicesId: number;
  public operativeSystemsId: number;

  /**
   * OperativeSystemsByDevices model constructor
   * @param { number } devicesId
   * @param { number } operativeSystemsId
   */
  constructor(devicesId: number, operativeSystemsId: number) {
    this.devicesId = devicesId;
    this.operativeSystemsId = operativeSystemsId;
  }
}
