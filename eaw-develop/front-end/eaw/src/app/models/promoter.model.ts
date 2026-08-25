import {User} from './user.model';

class Promoter extends User {
  public isActiveLabel: string;
  public clientsCreated: number;
}

export {Promoter};
