import {User} from './user.model';

class Evaluator extends User {
  public isActiveLabel: string;
  public evaluationsCompleted: number;
  public disabilities: [];
}

export {Evaluator};
