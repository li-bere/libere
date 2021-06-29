import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

/* class Pipes {
  constructor() {}

  redirectAuthenticatedTo = (redirectAuthenticated) =>
    pipe(
      map((user: firebase.User) =>
        user ? (user.emailVerified ? redirectAuthenticated : true) : true
      )
    )
} */

const redirectUnAuthenticatedTo = (
  redirectUnauthenticated,
  redirectEmailNotVerified
) =>
  pipe(
    map((user: firebase.User) =>
      user
        // ? user.emailVerified
        ? user.emailVerified
          ? true
          : redirectEmailNotVerified
        : redirectUnauthenticated
    )
  );

const redirectAuthenticatedTo = (redirectAuthenticated) =>
  pipe(
    map((user: firebase.User) =>
      // user ? (user.emailVerified ? redirectAuthenticated : true) : true
      user ? (user ? redirectAuthenticated : true) : true
    )
  );

const redirectUnAuthenticatedOrAuthenticatedTo = (
  redirectUnauthenticated,
  redirectAuthenticated
) =>
  pipe(
    map((user: firebase.User) =>
      user
        // ? user.emailVerified
        ? user
          ? redirectAuthenticated
          : true
        : redirectUnauthenticated
    )
  );

const redirectUnauthenticatedToLoginOrVerify = () =>
  redirectUnAuthenticatedTo(['login'], ['verifyemail']);
const redirectAuthenticatedToHome = () => redirectAuthenticatedTo(['home']);
const redirectHomeOrLogin = () =>
  redirectUnAuthenticatedOrAuthenticatedTo(['login'], ['home']);

export {
  redirectUnauthenticatedToLoginOrVerify,
  redirectAuthenticatedToHome,
  redirectHomeOrLogin,
};
