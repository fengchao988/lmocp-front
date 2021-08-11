import React, { useContext, useRef } from 'react';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import BsTree from '@ttyys/bs-marketization-web/BsTree';
import { Button, Popconfirm, Space } from 'antd';
import { useImmerReducer } from 'use-immer';
import { PlusOutlined } from '@ant-design/icons';

import ClassDailyModal from './ClassDailyModal'

const columns = [
  {
    title: '序号',
    align: 'center',
    valueType: 'index',
  },
  {
    title: '日报单号',
    align: 'center',
    dataIndex: 'dailyOrderNo',
    hideInSearch: true,
  },
  {
    title: '填报班组',
    align: 'center',
    dataIndex: 'classes',
    hideInSearch: true,
  },
  {
    title: '业务期间',
    align: 'center',
    dataIndex: 'businessTime',
    valueType: 'dateRange',
  },
  {
    title: '班次',
    align: 'center',
    dataIndex: 'grade',
    hideInSearch: true,
  },
  {
    title: '工作地点',
    align: 'center',
    dataIndex: 'workplace',
    hideInSearch: true,
  },
  {
    title: '出勤人数',
    align: 'center',
    dataIndex: 'attendanceCount',
    hideInSearch: true,
  },
  {
    title: '预期收入',
    align: 'center',
    dataIndex: 'income',
    hideInSearch: true,
  },
  {
    title: '跟班队长',
    align: 'center',
    dataIndex: 'teamLeader',
    hideInSearch: true,
  },
  {
    title: '提报时间',
    align: 'center',
    dataIndex: 'createTime',
    hideInSearch: true,
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
  },
  {
    title: '操作',
    align: 'center',
    valueType: 'option',
    width: 150,
    render: (text, record, _, action) => [
      <OptionEdit record={record} />,
      <Popconfirm
        title="确定要删除吗？"
        onConfirm={async () => {
          try {
            const res = await del(record.id);
            if (res.success) {
              message.success('删除成功');
              action?.reload();
            } else {
              message.error(res.message);
            }
          } catch (e) {
            console.log('e', e);
            message.error('删除失败');
          }
        }}
      >
        <a>删除</a>
      </Popconfirm>,
    ],
  },
];

const OptionEdit = ({ record }) => {
  const { dispatch } = useContext(TableContext);
  return (
    <a
      key="editable"
      onClick={() => dispatch({ type: 'edit', payload: record })}
    >
      编辑
    </a>
  );
};

export const TableContext = React.createContext(null);

const initialState = {
  record: {},
  type: null,
  depsFlag: false,
};

const reducer = (draft, action) => {
  switch (action.type) {
    case 'add':
      draft.type = 'add';
      draft.record = {};
      draft.depsFlag = !draft.depsFlag;
      break;
    case 'edit':
      draft.type = 'edit';
      draft.record = action.payload;
      draft.depsFlag = !draft.depsFlag;
      break;
    case 'view':
      draft.type = 'view';
      draft.record = action.record;
      draft.depsFlag = !draft.depsFlag;
  }
};

const ClassDailyList = () => {
  const actionRef = useRef();
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const handleAdd = () => {
    dispatch({ type: 'add' });
  };
  return (
    <ProCard split="vertical">
      <ProCard colSpan={4}>
        <BsTree />
      </ProCard>
      <ProCard colSpan={20}>
        <TableContext.Provider
          value={{ state, dispatch, refresh: actionRef.current?.reload }}
        >
          <ProTable
            rowKey="id"
            dateFormatter="string"
            columns={columns}
            dataSource={[]}
            toolbar={{
              title: (
                <Space>
                  <Button
                    key="button"
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={handleAdd}
                  >
                    新增
                  </Button>
                </Space>
              ),
            }}
          />
          <ClassDailyModal/>
        </TableContext.Provider>
      </ProCard>
    </ProCard>
  );
};

export default ClassDailyList;
