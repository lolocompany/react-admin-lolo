import React, {useEffect, useState} from 'react'
import {Hub, Auth} from 'aws-amplify';

function useAuth (isCustomConfigured) {
  const [jwtToken, setJwtToken] = useState(null)

  const getCurrentSession = async () => {
    try {
      const session = await Auth.currentSession()
      setJwtToken(session.idToken.jwtToken)
    } catch(e) {
      setJwtToken(null)
    }
  }

  const getCurrentLocalStorageValue = () => {
    return setJwtToken(localStorage.getItem('token') || null)
  }

  useEffect(() => {
    if(isCustomConfigured) {
      getCurrentLocalStorageValue()

      window.addEventListener('localStorageItemUpdated', (e) => {
        e.value ? setJwtToken(e.value) : setJwtToken(null)
      }, false)
    } else {
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
    }

    return () => {
      window.removeEventListener('localStorageItemUpdated', () => {})
    }
  }, [isCustomConfigured])

  return {jwtToken}
}

export default useAuth