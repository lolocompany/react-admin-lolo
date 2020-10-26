import { Auth } from 'aws-amplify';

Auth.configure({
  Auth: {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_QHFROumrL',
    userPoolWebClientId: '2fdpo91r8b6ing6f3558kia6rb'
  }
});

export default {
  login: params => Promise.resolve(),
  logout: params => Auth.signOut(),
  checkAuth: params => Auth.currentSession(),
  checkError: error => Promise.resolve(),
  getPermissions: params => Promise.resolve()
};
