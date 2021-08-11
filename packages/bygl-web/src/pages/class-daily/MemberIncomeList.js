import React from 'react';
import { ProFormEditableProTable } from '@ttyys/bs-marketization-web';

const columns = [
  {
    title: '姓名',
    dataIndex: 'username',
    align: 'center',
  },
  {
    title: '岗位',
    dataIndex: 'post',
    align: 'center',
  },
  {
    title: '类别',
    dataIndex: 'type',
    align: 'center',
  },
  {
    title: '出勤',
    dataIndex: 'attendance',
    align: 'center',
  },
  {
    title: '计件收入',
    dataIndex: 'countIncome',
    valueType: 'money',
    align: 'center',
  },
  {
    title: '零星收入',
    dataIndex: 'otherIncome',
    valueType: 'money',
    align: 'center',
  },
  {
    title: '班组考核',
    dataIndex: 'classesAccessIncome',
    valueType: 'money',
    align: 'center',
  },
  {
    title: '包岗收入',
    dataIndex: 'postIncome',
    valueType: 'money',
    align: 'center',
  },
  {
    title: '技能工资',
    dataIndex: 'skillIncome',
    valueType: 'money',
    align: 'center',
  },
  {
    title: '学习培训市场',
    dataIndex: 'trainIncome',
    valueType: 'money',
    align: 'center',
  },
];

const MemberIncomeList = () => {
  return <ProFormEditableProTable columns={columns} />;
};

export default MemberIncomeList;
