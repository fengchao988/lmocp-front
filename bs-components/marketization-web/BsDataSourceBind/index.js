import React from "react";
import PropTypes from "prop-types";
import * as R from "ramda";
import { useImmerReducer } from "use-immer";
import useBindStore from "@ttyys/hooks/useBindStore";
import useSingleFetch from "@ttyys/hooks/useSingleFetch";
import useDeepEffect from "@ttyys/hooks/useDeepEffect";

const BindComp = ({
  bindStore,
  bindPropPath = "$.dataSource",
  bindParamsPath = "$.params",
  bindFetchPath = "$.fetchData",
  bindSetParamPath = "$.setParams",
  bindParams = {},
  actions = [],
  children,
  multiply = false,
  ...resProps
}) => {
  const dataSource = useBindStore(bindStore, bindPropPath);
  const fetchData = useBindStore(bindStore, bindFetchPath);
  const setParams = useBindStore(bindStore, bindSetParamPath);

  useDeepEffect(() => {
    typeof setParams === "function" && setParams(bindParamsPath, bindParams);
    typeof fetchData === "function" && fetchData();
  }, [bindParams]);
  useSingleFetch(() => {
    typeof fetchData === "function" && fetchData();
  }, `multiply`);

  const prop = R.pipe(R.split("."), R.last)(bindPropPath);

  return React.cloneElement(children, {
    [prop || "dataSource"]: dataSource,
    ...resProps,
  });
};

/**
 * {
            type: 'event',
            dispatch: [{
              store: 'currentDayFinishDescriptionStoreStore',
              prop: '$.params.teamId',
              action: '$.reload',
            }, {
              store: 'currentDayFinishDescriptionStoreStore',
              prop: '$.params.teamId',
              action: '$.reload',
            }],
            methodName: 'onSelect',
          }]
 * @param actions
 */

BindComp.propTypes = {
  bindPropPath: PropTypes.string.isRequired,
  bindStore: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["event", "route", "api", "store"]),
      dispatch: PropTypes.arrayOf(
        PropTypes.shape({
          store: PropTypes.string.isRequired,
          prop: PropTypes.string.isRequired,
          action: PropTypes.string,
        })
      ),
      methodName: PropTypes.string,
    })
  ),
};

BindComp.defaultProps = {
  actions: [],
  actionType: "serial",
};

export default BindComp;
