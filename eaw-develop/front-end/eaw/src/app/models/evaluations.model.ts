import {Packages} from './packages.model';
/**
 * Evaluations model
 */
export class Evaluations {
  public id: number;
  public evaluationCode: string;
  public siteName: string;
  public manualEvaluationState: number;
  public automaticEvaluationState: number;
  public domain: string;
  public mainUrl: string;
  public siteMap: JSON;
  public scrapingState: number;
  public pagesChoosed: string;
  public managerialReportState: number;
  public nodeId: number;
  public technicalReportState: number;
  public packagesId: number;
  public segmentsId: number;
  public clientsId: number;
  public languagesId: number;
  public especificationsQuantity: number;
  public remainingDays: number;
  public sendedResults: boolean;
  public evaluator: any;
  public createdAt: Date;
  public updatedAt: Date;
  public updatedBy: number;
  public createdBy: number;

  public evaluationsPackages: Packages;

  /**
   * Evaluations model constructor
   * @param { number } id
   * @param { string } evaluationCode
   * @param { string } siteName
   * @param { number } manualEvaluationState
   * @param { number } automaticEvaluationState
   * @param { string } domain
   * @param { string } mainUrl
   * @param { JSON } siteMap
   * @param { number } scrapingState
   * @param { string } pagesChoosed
   * @param { number } managerialReportState
   * @param { number } nodeId
   * @param { number } technicalReportState
   * @param { number } packagesId
   * @param { number } segmentsId
   * @param { number } clientsId
   * @param { number } languagesId
   * @param { number } especificationsQuantity
   * @param { number } remainingDays
   * @param { any } evaluator
   * @param { Date } createdAt
   * @param { Date } updatedAt
   * @param { number } updatedBy
   * @param { number } createdBy
   */
  constructor(
    id: number = 0,
    evaluationCode: string,
    siteName: string = null,
    manualEvaluationState: number = null,
    automaticEvaluationState: number = null,
    domain: string = null,
    mainUrl: string = null,
    siteMap: JSON = null,
    scrapingState: number = null,
    pagesChoosed: string = null,
    managerialReportState: number = null,
    nodeId: number = null,
    technicalReportState: number = null,
    packagesId: number = null,
    segmentsId: number = null,
    clientsId: number = null,
    languagesId: number = null,
    especificationsQuantity: number = null,
    remainingDays: number = null,
    sendedResults: boolean = false,
    evaluator: any = null,
    createdAt: Date = null,
    updatedAt: Date = null,
    updatedBy: number = null,
    createdBy: number = null,
  ) {
    this.id = id;
    this.evaluationCode = evaluationCode;
    this.siteName = siteName;
    this.manualEvaluationState = manualEvaluationState;
    this.automaticEvaluationState = automaticEvaluationState;
    this.domain = domain;
    this.mainUrl = mainUrl;
    this.siteMap = siteMap;
    this.scrapingState = scrapingState;
    this.pagesChoosed = pagesChoosed;
    this.managerialReportState = managerialReportState;
    this.nodeId = nodeId;
    this.technicalReportState = technicalReportState;
    this.packagesId = packagesId;
    this.segmentsId = segmentsId;
    this.clientsId = clientsId;
    this.languagesId = languagesId;
    this.especificationsQuantity = especificationsQuantity;
    this.remainingDays = remainingDays;
    this.sendedResults = sendedResults;
    this.evaluator = evaluator;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.createdBy = createdBy;
  }
}
