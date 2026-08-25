import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-selection-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
})
/**
 * Step of selection component
 */
export class StepComponent {
  @Input() public step: number;
  @Output() public selectedStep;

  constructor() {
    this.selectedStep = new EventEmitter<any>();
  }

  /**
   * Emit an event when a step is selected
   * @param selectedStep
   */
  public onStepChange(selectedStep: number): void {
    this.selectedStep.emit(selectedStep);
  }
}
