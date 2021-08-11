import React, { useContext, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { request, stores } from 'umi';
import { Button, Popconfirm, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useImmerReducer } from 'use-immer';

import ParameterModal from "./ParameterModal";
import AddParamsModal from "./AddParamsModal";

const delParameter = (id) =>
  request(`/llot-common/workplace/condition/delete/${id}`, {
    method: 'delete',
  });

const getList = (params) =>
  new Promise((resolve) => {
    request('/llot-common/workplace/condition/page', {
      params: {
        ...params,
        pageNo: params.current,
      },
    }).then((res) => {
      resolve({
        data: res?.result?.records || [],
        total: res?.result?.total || 0,
        success: true,
      });
    });
  });

const columns = [
  {
    title: '条件编码',
    dataIndex: 'code',
    align: 'center',
    width: 100,
    hideInSearch: true,
  },
  {
    title: '作业条件',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'conditionTypeName',
    align: 'center',
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    align: 'center',
    width: 200,
    render: (text, record, _, action) => [
      <OptionEdit record={record} />,
      <OptionAddParameter record={record} />,
      <OptionDel record={record} />,
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

const OptionAddParameter = ({record}) => {
  const { dispatch } = useContext(TableContext);
  const handleAddParameters = () => {
    dispatch({ type: 'parameter', payload: record });
  }
  if (record.conditionType === 'REGULAR') {
    return <a onClick={handleAddParameters}>添加条件参数</a>;
  }
  return <span style={{ color: 'darkgray' }}>添加条件参数</span>;
};

const OptionDel = ({ record }) => {
  const { refresh } = useContext(TableContext);
  return (
    <Popconfirm
      title="确定要删除吗？"
      onConfirm={async () => {
        try {
          const res = await delParameter(record.id);
          if (res.success) {
            message.success('删除成功');
            refresh();
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
    </Popconfirm>
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
      draft.record = action.payload;
      draft.depsFlag = !draft.depsFlag;
      break;
    case 'parameter':
      draft.type = 'parameter';
      draft.record = action.payload;
      draft.depsFlag = !draft.depsFlag;
      break;
  }
};

const ParameterList = () => {
  const actionRef = useRef();
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const handleAdd = () => {
    dispatch({ type: 'add' });
  };
  useEffect(() => {
    stores.parameterTypeStore.fetchData();
  }, []);
  return (
    <TableContext.Provider value={{ state, dispatch, refresh: actionRef.current?.reload }}>
      <ProTable
        options={false}
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        editable={{ type: 'single' }}
        dateFormatter="string"
        request={getList}
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
      <ParameterModal/>
      <AddParamsModal/>
    </TableContext.Provider>
  );
};

export default ParameterList;
