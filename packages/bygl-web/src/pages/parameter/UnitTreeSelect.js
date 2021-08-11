import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { request } from 'umi';

const queryUnitType = (params) => request('/llot-common/measure/unit_category/list', {
  method: 'get',
  params: params,
});

const transferData = data =>  data.map(item =>({
  key: item.id,
  value: item.id,
  title: item.name,
  selectable: false,
  children: item.measureUnits.length ? item.measureUnits.map(m => ({
    key: m.id,
    value: m.id,
    title: m.name,
    isLeaf: true,
  })): null,
}));

const UnitTreeSelect = ({ ...restProps }) => {
  const [treeData, setTreeData] = useState([]);
  useEffect(() => {
    queryUnitType().then(res => {
      setTreeData(transferData(res.result));
    });
  }, []);

  return (
    <TreeSelect
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      {...restProps}
    />
  );
};

export default UnitTreeSelect;
