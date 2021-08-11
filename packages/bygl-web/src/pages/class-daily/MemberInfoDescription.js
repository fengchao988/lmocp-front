import React from 'react';
import ProDescriptions from "@ant-design/pro-descriptions";

const columns = [{
  title: '区队',
  dataIndex: 'organization',
}, {
  title: '班组',
  dataIndex: 'classes',
}, {
  title: '业务区间',
  dataIndex: 'businessTime',
}, {
  title: '工作地点',
  dataIndex: "workplace"
}, {
  title: '班次',
  dataIndex: 'grade'
}, {
  title: '跟班班长',
  dataIndex: 'teamLeader',
}];

const MemberInfoDescription = ({ dataSource }) => {
  return <ProDescriptions columns={columns} column={6} dataSource={dataSource}/>
};

export default MemberInfoDescription;
