import React from 'react';
import {ProFormEditableProTable} from "@ttyys/bs-marketization-web";

const columns = [{
  title: '序号',
  valueType: 'index',
  align: 'center',
},{
  title: '项目',
  dataIndex: 'prod',
  editable: false,
  align: 'center',
}, {
  title: '名称',
  dataIndex: 'name',
  editable: false,
  align: 'center',
}, {
  title: '单价',
  dataIndex: 'price',
  valueType: 'money',
  editable: false,
  align: 'center',
}, {
  title: '数量',
  dataIndex: 'count',
  valueType: 'digit',
  align: 'center',
  formItemProps: {
    rules: [{
      required: true,
      message: '必填'
    }]
  }
}, {
  title: '费用合计',
  dataIndex: 'total',
  valueType: 'money',
  editable: false,
  align: 'center',
}];

const OtherWorkList = () => {
  return <ProFormEditableProTable
    columns={columns}
    headerTitle="零星工作"
  />
};

export default OtherWorkList;
