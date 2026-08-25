import {InjectionToken} from '@angular/core';
import {environment} from './environments/environment';

const API_ENDPOINT = `http://${environment.apiHost}:${environment.apiPort}/`;

export interface IAppConfig {
  API_ENDPOINT_EAW: string;
  ENCRYPTION_KEY: string;
}

export const AppConfig: IAppConfig = {
  API_ENDPOINT_EAW: `${API_ENDPOINT}eaw-api/`,
  ENCRYPTION_KEY: '2c251d30-d607-11e7-b40f-541379bf221d',
};

export let APP_CONFIG = new InjectionToken<IAppConfig>('app.config');
