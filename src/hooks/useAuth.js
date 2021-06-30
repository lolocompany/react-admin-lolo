import React, {useEffect, useState} from 'react'
import { authProvider } from '../auth_provider';

function useAuth () {
  const [jwtToken, setJwtToken] = useState(null)

  useEffect(() => {
    authProvider.init(token => {
      setJwtToken(token)
    })
  }, [])

  return {jwtToken}
}

export default useAuth