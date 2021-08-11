import React from "react";
import PropTypes from 'prop-types';
import { Select } from "antd";

import BsDataSourceBind from '../BsDataSourceBind'

const NormalComp = ({ dataSource, ...restProps }) => {
  return (
    <Select {...restProps} placeholder="请选择">
      {dataSource.map((m) => (
        <Select.Option key={m.key} value={m.value}>
          {m.label}
        </Select.Option>
      ))}
    </Select>
  );
};

const BsSelect = ({
  dataSource,
  bindStore,
  bindPropPath,
  multiply,
  ...restProps
}) => {
  if (bindStore && bindPropPath) {
    return (
      <BsDataSourceBind
        bindStore={bindStore}
        bindPropPath={bindPropPath}
        multiply={multiply}
        {...restProps}
      >
        <NormalComp />
      </BsDataSourceBind>
    );
  }
  return <NormalComp dataSource={dataSource} {...restProps} />;
};

BsSelect.propTypes = {
    dataSource: PropTypes.array,
    /**
     * 绑定store名称
     */
    bindStore: PropTypes.string,
    /**
     * 绑定store属性路径 查阅jsonpath
     */
    bindPropPath: PropTypes.string,
    /**
     * 是否多同一个一面内多个实例 如果不是多个实例默认请求数据为store内的fetchData 方法
     */
    multiply: PropTypes.bool,
};

BsSelect.defaultProps = {
    dataSource: [],
    multiply: false,
}

export default BsSelect;
