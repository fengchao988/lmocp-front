import React from 'react';
import { ProFormEditableProTable } from '@ttyys/bs-marketization-web';

const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '人工单价',
    dataIndex: 'price',
    valueType: 'money',
    align: 'center',
    width: 100,
    editable: false,
  },
  {
    title: '数量',
    dataIndex: 'count',
    valueType: 'digit',
    align: 'center',
    width: 100,
  },
  {
    title: '费用合计',
    dataIndex: 'total',
    editable: false,
    valueType: 'money',
    align: 'center',
    width: 150,
  },
];

const CurrentClassProdCostList = () => {
  return <ProFormEditableProTable headerTitle="本班产品" columns={columns} />;
};

export default CurrentClassProdCostList;
