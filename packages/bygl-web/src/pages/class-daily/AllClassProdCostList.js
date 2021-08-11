import React from 'react';
import ProTable from "@ant-design/pro-table";

const columns = [{
  title: '班组',
  dataIndex: 'classes',
  align: 'center',
}, {
  title: '项目名称',
  dataIndex: 'name',
  align: 'center',
}, {
  title: '单位',
  dataIndex: 'unit',
  align: 'center',
},{
  title: '数量',
  dataIndex: 'count',
  align: 'center',
}];

const AllClassProdCostList = ({ dataSource }) => {
  return <ProTable
    rowKey="id"
    headerTitle="全区产品"
    options={false}
    search={false}
    columns={columns}
    dataSource={dataSource}
  />
};

export default AllClassProdCostList;
