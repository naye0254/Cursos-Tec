import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {LanguageConfigComponent} from './language-config.component';

@Injectable()
export class ConfiguratinLanguageService {
  constructor(public matDialog: MatDialog) {}

  openConfigurationLanguagePage(): void {
    this.matDialog.open(LanguageConfigComponent, {
      width: '80vh',
      data: {},
    });
  }
}
