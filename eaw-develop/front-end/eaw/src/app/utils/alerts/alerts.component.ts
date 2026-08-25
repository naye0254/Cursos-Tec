import {Component, Inject} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser/';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {
  title: string;
  public btnOkText?: string;
  message: any;
  type: string;
  defaultClass: string;
  classModalError: any = 'modal-content-error';
  classModalSuccess: any = 'modal-content-success';
  classModalWarning: any = 'modal-content-warning';
  classModalConsultant: any = 'modal-content-consultant';
  classHeaderModalError: any = 'title-modal title-modal-error';
  classHeaderModalSuccess: any = 'title-modal title-modal-success';
  classHeaderModalWarning: any = 'title-modal title-modal-warning';
  classHeaderModalConsultant: any = 'title-modal title-modal-consultant';
  iconSuccess: '';

  constructor(
    public dialogRef: MatDialogRef<AlertsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer,
  ) {
    this.title = 'Cuadro de Confirmación';
    this.btnOkText = 'Continuar';
  }

  getClassModal(type: string) {
    switch (type) {
      case 'error':
        return this.classModalError;
      case 'éxito':
        return this.classModalSuccess;
      case 'advertencia':
        return this.classModalWarning;
      case 'consultant':
        return this.classModalConsultant;
      default:
        return this.defaultClass;
    }
  }
  getClassModalHeader(type: string) {
    switch (type) {
      case 'error':
        return this.classHeaderModalError;
      case 'éxito':
        return this.classHeaderModalSuccess;
      case 'advertencia':
        return this.classHeaderModalWarning;
      case 'consultant':
        return this.classHeaderModalConsultant;
      default:
        return this.defaultClass;
    }
  }

  getIcon(type: string) {
    switch (type) {
      case 'error':
        return this.sanitizer
          .bypassSecurityTrustHtml(`<i role="img" attr.aria-label=" ícono de ${type}"
                 class="fas fa-info-circle fa-2x"></i>`) as string;
      case 'éxito':
        return this.sanitizer
          .bypassSecurityTrustHtml(`<i role="img" attr.aria-label=" ícono de ${type}"
                  class="fas fa-check-circle fa-2x"></i>`) as string;
      case 'advertencia':
        return this.sanitizer
          .bypassSecurityTrustHtml(`<i role="img" attr.aria-label=" ícono de ${type}"
                  class="fas fa-exclamation-triangle fa-2x"></i>`) as string;
      case 'consultant':
        return this.sanitizer
          .bypassSecurityTrustHtml(`<i role="img" attr.aria-label=" ícono de éxito"
                  class="fas fa-check-circle fa-2x"></i>`) as string;
      default:
        return;
    }
  }

  sanitizerCode(code: string) {
    this.message = this.sanitizer.bypassSecurityTrustHtml(code) as string;
    return this.message;
  }

  getText(text) {
    return this.sanitizer.bypassSecurityTrustHtml(text) as string;
  }

  public confirmFunction() {
    this.data.confirmFn();
    this.dialogRef.close();
  }
}
