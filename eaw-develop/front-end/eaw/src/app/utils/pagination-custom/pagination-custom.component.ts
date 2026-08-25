import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'pagination-custom',
  templateUrl: './pagination-custom.component.html',
  styleUrls: ['./pagination-custom.component.scss'],
})
export class PaginationCustomComponent {
  @Input() id: string;
  @Input() maxSize = 5;
  @Input() nothingMessage: string;

  @Output() emitPage: EventEmitter<any>;

  public previousLabel = 'Anterior';
  public screenReaderPageLabel = 'Página';
  public nextLabel = 'Siguiente';
  public screenReaderCurrentLabel = 'Usted está en la página';
  public directionLinks = true;

  constructor() {
    this.emitPage = new EventEmitter<any>();
    this.nothingMessage = 'No se han encontrado resultados.';
  }

  handlePagination(pagination: any) {
    this.emitPage.emit(pagination);
  }
}
