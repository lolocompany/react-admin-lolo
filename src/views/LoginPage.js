import React from 'react';
import { useLogin } from 'react-admin';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { AmplifySignIn, AmplifyAuthenticator } from '@aws-amplify/ui-react';

const LoginPage = () => {
  const login = useLogin();

  React.useEffect(() => {
    onAuthUIStateChange(nextAuthState => {
      if (nextAuthState === AuthState.SignedIn) {
        login();
      }
    });
  }, []);

  return (
    <div className="amplify-form-wrapper">
      <AmplifyAuthenticator>
        <AmplifySignIn slot="sign-in" usernameAlias="email" hideSignUp />
      </AmplifyAuthenticator>
    </div>
  );
};
export default LoginPage;
