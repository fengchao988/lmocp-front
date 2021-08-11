import { useObserver } from "mobx-react";
import useMst from "./useMst";
import jp from "jsonpath";

const useBindStore = (bindStore, bindPath) => {
  const store = useMst((state) => state[bindStore]);
  if (!bindStore || !bindPath) {
    throw new Error("未绑定参数");
  }
  if (!store) {
    throw new Error(`未发现store：${bindStore}`);
  }
  const value = jp.query(store, bindPath);
  return useObserver(() =>
    !value.length
      ? undefined
      : Array.isArray(value[0])
      ? value[0].slice()
      : value[0]
  );
};

export default useBindStore;
