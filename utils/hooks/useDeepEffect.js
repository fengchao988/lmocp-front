import {useEffect, useRef} from "react";
import * as R from 'ramda';

const useDeepCompareMemoize = (value) => {
    const ref = useRef();
    if (!R.equals(value, ref.current)) {
        ref.current = value;
    }
    return ref.current;
}
const useDeepEffect = (fn, deps = []) => {
    useEffect(fn, deps.map(useDeepCompareMemoize))
};

export default useDeepEffect;