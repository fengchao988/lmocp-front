import { useEffect, useRef } from "react";

const useIsMount = () => {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = true;
    return () => {
        ref.current = false;
    }
  }, []);

  return ref.current;
};

export default useIsMount;
