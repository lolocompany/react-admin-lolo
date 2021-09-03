import Amplify, { Auth, Hub } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_lQin10bBN',
    userPoolWebClientId: '2j7v5uee5qc13p6kncmlrjqq0q',
  },
});

let authProvider = {
  init: async updateAuth => {
    let token = null;

    token = await (async () => {
      try {
        const session = await Auth.currentSession();
        return session.idToken.jwtToken;
      } catch (e) {
        return null;
      }
    })();

    Hub.listen('auth', data => {
      const {
        payload: {
          event,
          data: {
            signInUserSession: {
              idToken: { jwtToken },
            },
          },
        },
      } = data;
      updateAuth(event === 'signIn' ? jwtToken : null);
    });

    updateAuth(token);
  },
  login: params => Promise.resolve(),
  logout: params => {
    localStorage.clear();
    return Auth.signOut();
  },
  checkAuth: params => Auth.currentSession(),
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve(),
};

class AuthProvider {
  constructor(options) {
    if (options) {
      authProvider = Object.assign(authProvider, options);
    }
  }
}

export { AuthProvider, authProvider };
