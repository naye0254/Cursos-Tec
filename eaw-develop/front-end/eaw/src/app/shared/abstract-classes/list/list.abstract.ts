import {MatPaginator} from '@angular/material/paginator';
import {ListConstants} from './list.constants';

/**
 * Class to reuse the functions of the list
 */
export abstract class GenericList {
  /**
   * Set status labels to list
   * @param listItems data list
   */
  public setStatusLabel(listItems: any[]): any[] {
    listItems.map(item => {
      if (item.isActive) {
        item.isActiveLabel = 'Activo';
      } else {
        item.isActiveLabel = 'Inactivo';
      }
    });
    return listItems;
  }

  /**
   *  Set labels custom to paginator
   * @param paginator mat-paginator
   */
  public initTableLabels(paginator: MatPaginator): void {
    paginator._intl.itemsPerPageLabel = ListConstants.TABLE_LABELS.itemPerPage;
    paginator._intl.nextPageLabel = ListConstants.TABLE_LABELS.nextPageLabel;
    paginator._intl.previousPageLabel =
      ListConstants.TABLE_LABELS.previousPageLabel;
    paginator._intl.lastPageLabel = ListConstants.TABLE_LABELS.lastPageLabel;
    paginator._intl.firstPageLabel = ListConstants.TABLE_LABELS.firstPageLabel;
  }

  /**
   * Filter the list
   * @param event filter
   * @param tableDataSource list to filter
   */
  public applyFilter(event: Event, tableDataSource: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    tableDataSource.filter = filterValue.trim().toLowerCase();
    return tableDataSource;
  }
}
