import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tree, Empty } from "antd";
import useDeepEffect from "@ttyys/hooks/useDeepEffect";

const transferDataSource = (dataSource, selectableRange = "0") => {
  const _transfer = (data, level = 0) =>
    data.map((m) => {
      let selectable = true;
      if (selectableRange === "-1") {
        selectable = !(level === 0 || (m.children && m.children.length > 0));
      } else if (selectableRange === ">0") {
        selectable = !(level === 0);
      }
      return {
        ...m,
        selectable,
        children:
          m.children && m.children.length
            ? _transfer(m.children, level + 1)
            : undefined,
      };
    });
  return _transfer(dataSource);
};

const BsTree = ({ dataSource, selectableRange, ...restProps }) => {
  const [_dataSource, setDataSource] = useState([]);
  useDeepEffect(() => {
    setDataSource(transferDataSource(dataSource, selectableRange));
  }, [dataSource, selectableRange]);
  return _dataSource.length ? (
    <Tree treeData={_dataSource} defaultExpandAll {...restProps} />
  ) : (
    <Empty />
  );
};

BsTree.propTypes = {
  dataSource: PropTypes.array,
  /**
   * 可选中的节点
   * 0： 全可选
   * -1： 最后个节点可选， 如果只有一层，也不可选
   * 》0: 除了第一层都可选
   */
  selectableRange: PropTypes.oneOf(["0", "-1", ">0"]),
};

BsTree.defaultProps = {
  dataSource: [],
  selectableRange: "0",
};

export default BsTree;
