/**
 * ErrorDebug model
 */
export class ErrorDebug {
    public id: number;
    public locationName: string;
    public errorDescription: string;
    public errorDateAt: string;
	public fixed:number;
	public evaluationsId:number;
    
    /**
     * Country model constructor
     * @param { number } id
     * @param { string } locationName
     * @param { string } errorDescription
     * @param { string } errorDateAt
     * @param { number } fixed
     * @param { number } evaluationsId
     */
    constructor(
      id: number,
      locationName: string,
      errorDescription: string,
      errorDateAt: string,
      fixed: number,
      evaluationsId: number
    ) {
      this.id = id;
      this.locationName = locationName;
      this.errorDescription = errorDescription;
      this.errorDateAt = errorDateAt;
      this.fixed = fixed;
      this.evaluationsId = evaluationsId;
    }
  }
  