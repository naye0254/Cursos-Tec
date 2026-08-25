import {Injectable} from '@angular/core';

@Injectable()
class ProfileConstants {
  /**
   * Length of the values form profile.
   */
  public static FORM_PROFILE_OPTIONS = {
    lengthInputFirstName: 255,
    lengthInputLastName: 255,
    lengthInputEmail: 255,
    lengthInputTelephone: 30,
    lengthInputUserName: 255,
  };

  /**
   * Length of the values modal form change password.
   */
  public static FORM_CHANGE_PASSWORD_OPTIONS = {
    lengthInputPassword: 255,
  };
}
export {ProfileConstants};
