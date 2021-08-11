import { useEffect } from "react";
import useIsMount from "./useIsMount";

const useSingleFetch = ( fn = () => undefined, multiply = false) => {
    const isMount = useIsMount();
    useEffect(() => {
        if (isMount && !multiply) {
            fn();
        }
    }, [multiply, isMount])
};

export default useSingleFetch;