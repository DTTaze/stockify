import { useEffect, useState } from "react";

/**
 * Hook to check if the component has been mounted on the client.
 * Useful for avoiding hydration mismatch errors when server and client renders differ.
 * @returns {boolean} true if mounted (client), false if rendering on the server
 */
const useCheckHydrationMismatch = (): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};

export default useCheckHydrationMismatch;
