import {User} from './user.model';
/**
 * Clients model
 */
export class Clients extends User {
  public address: string;
  public countryRegion: string;
  public city: string;
  public postalCode: string;

  public isActiveLabel: string;
  public countriesId: number;
  public segments: number[];
}
