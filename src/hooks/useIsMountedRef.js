import React, { useEffect, useRef } from 'react';

function useIsMountedRef() {
  const isMountedRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  }, []);

  return isMountedRef;
}

export default useIsMountedRef;
