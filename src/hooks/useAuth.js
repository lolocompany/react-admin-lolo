import React, { useEffect, useState } from 'react';
import { authProvider } from '../providers';

function useAuth() {
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    authProvider.init(token => {
      setJwtToken(token);
    });
  }, []);

  return { jwtToken };
}

export default useAuth;
