import React, {useEffect, useState} from 'react'
import {Hub, Auth} from 'aws-amplify';

function useAuth () {
  const [jwtToken, setJwtToken] = useState(null)

  const getCurrentSession = async () => {
    try {
      const session = await Auth.currentSession()
      setJwtToken(session.idToken.jwtToken)
    } catch(e) {
      setJwtToken(null)
    }
  }

  useEffect(() => {
    getCurrentSession()

    Hub.listen('auth', (data) => {
      const {payload: {
        event,
        data: {
          signInUserSession: {
            idToken: {jwtToken}
          }
        }
      }} = data
      setJwtToken(event === 'signIn' ? jwtToken : null)
    })

  }, [])

  return {jwtToken}
}

export default useAuth