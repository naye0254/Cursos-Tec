import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {PaginationInstance} from 'ngx-pagination';
import {Evaluations} from '../../../../../models/evaluations.model';
import { EvaluationErrorService } from './evaluationerror.service';
import { SharedService } from 'src/app/shared/shared.service';
import { CommonConstants } from 'src/app/common/common.constants';
import { ErrorDebug } from '../../../../../models/errorDebugs.model';
import { EvaluationsService } from '../../../../../direct-consultant/evaluations/evaluations.service'

@Component({
    selector: 'app-evaluationerror',
    templateUrl: 'evaluationerror.component.html',
    styleUrls: ['./evaluationerror.component.scss'],
    providers: [EvaluationsService],
})

export class EvaluationErrorComponent implements OnInit {
    public pagConfig: PaginationInstance;
    private evaluationId: number;
    public evaluation: Evaluations;
    public errordebug: any;
    public directClientRole: number;
    public userRole: number;
    public evaluationErrorDebugs: ErrorDebug[];
    public datos : any;

    /**
     * Constructor method
     * @param router
     * @param activatedRoute
     * @param evaluationsService
     * @param evaluationErrorService
     * @param sharedService
     */
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private evaluationsService: EvaluationsService,
        private evaluationErrorService: EvaluationErrorService,
        private sharedService: SharedService
    ){
        
        this.evaluationId = +this.activatedRoute.snapshot.paramMap.get('id');
        this.directClientRole = CommonConstants.roles.DirectClient;
        this.userRole = this.sharedService.getUserInfoFromLocalStorage().roleTypesId;
    }

    ngOnInit(): void {
        this.getErrorByEvaluation();
        this.getEvaluation();
    }

    private getErrorByEvaluation(){
        this.evaluationErrorService
        .getErrorByEvaluation(this.evaluationId)
        .subscribe(data => {
            this.evaluationErrorDebugs = data;
        })
    }

    public getEvaluation(){
        /**
         * En esta función se debería poder asignar
         * data.results a evaluation
         * subscribe(data => { this.evaluation = data.results }) */
        this.evaluationsService
        .getEvaluationById(this.evaluationId)
        .subscribe(data => {
            this.datos = data.results.siteName;
        })
    }

    private goListEvaluations(){
        this.router.navigateByUrl('/administrator/evaluations/list-evaluations');
    }
}