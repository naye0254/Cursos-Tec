import { ModuleWithProviders } from '@angular/core';

export class NgMultiSelectDropDownModule {
    static forRoot(): ModuleWithProviders {
      return {
        ngModule: NgMultiSelectDropDownModule
      };
    }
}
