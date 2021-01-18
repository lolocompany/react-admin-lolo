import { Auth } from 'aws-amplify';

Auth.configure({
  Auth: {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_lQin10bBN',
    userPoolWebClientId: '2j7v5uee5qc13p6kncmlrjqq0q'
  }
});

export default {
  login: params => Promise.resolve(),
  logout: params => Auth.signOut(),
  checkAuth: params => Auth.currentSession(),
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve()
};
