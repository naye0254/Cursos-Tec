/**
 * SupportToolsByManualPages model
 */
export class SupportToolsByManualPages {
  public supportToolsId: number;
  public manualPagesId: number;

  /**
   * SupportToolsByManualPages model constructor
   * @param { number } supportToolsId
   * @param { number } manualPagesId
   */
  constructor(supportToolsId: number, manualPagesId: number) {
    this.supportToolsId = supportToolsId;
    this.manualPagesId = manualPagesId;
  }
}
