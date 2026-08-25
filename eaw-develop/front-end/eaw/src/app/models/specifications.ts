import {Devices} from './devices.model';
import {OperativeSystems} from './operativeSystems.model';
import {OperativeSystemVersions} from './operativeSystemVersions.model';
import {Browsers} from './browsers.model';
import {SupportTools} from './supportTools.model';

/**
 * Specification class
 */
export class Specifications {
  id: number;
  evaluationsId: number;
  supportToolsId: number;
  operativeSystemId: number;
  devicesId: number;
  browsersId: number;
  usersId: number;
  disabilitiesId: number;
  state: number;

  specificationsDevices: Devices;
  specificationsOperativeSystems: OperativeSystems;
  operativeSystemVersion: OperativeSystemVersions;
  specificationsBrowsers: Browsers;
  specificationsSupportTools: SupportTools;

  isSelected = false;
}
