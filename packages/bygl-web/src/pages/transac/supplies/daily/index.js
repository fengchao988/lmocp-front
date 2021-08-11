import React, { useContext, useReducer, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Space } from 'antd';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { request } from 'umi';
import { useImmerReducer } from 'use-immer';


const columns = [
  {
    title: '结算单号',
    dataIndex: 'settlementNo',
    align: 'center',
    hideInSearch: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
  },
  {
    title: '业务期间',
    dataIndex: 'businessDate',
    align: 'center',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
  },
  {
    title: '总金额',
    dataIndex: 'total',
    align: 'center',
    hideInSearch: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
  },
  {
    title: '提报时间',
    dataIndex: 'reportingTime',
    align: 'center',
    hideInSearch: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
  },
  {
    title: '操作',
    valueType: 'option',
    align: 'center',
    width: 150,
    render: (text, record, _) => [
      <a key="editable" onClick={() => {
      }}>编辑</a>,
      <a>查看</a>,
    ],
  },
];

const deleteRequest = (id) =>
  request('/sys/user/delete', {
    method: 'delete',
    params: {
      id,
    },
  });

const frozenBatch = (params) =>
  request('/sys/user/frozenBatch', {
    method: 'put',
    data: params,
  });

export const OperationContext = React.createContext(null);

const OperationEdit = ({ record }) => {
  const { dispatch } = useContext(OperationContext);
  const handleEdit = () => {
    dispatch({
      type: 'edit',
      payload: record,
    });
  };
  return (
    <a key="edit" onClick={handleEdit}>
      编辑
    </a>
  );
};

const OperationMore = ({ record, action }) => {
  const { dispatch } = useContext(OperationContext);
  const handleSelect = (key) => {
    dispatch({ type: key, payload: record });
  };

  const handleDel = async () => {
    try {
      await deleteRequest(record.id);
      action?.reload();
      message.success('删除成功');
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleFrozen = async () => {
    //TODO 后台校验管理员角色
    if ('admin' === record.username) {
      message.warning('管理员账号不允许此操作！');
      return;
    }
    const status = {
      1: 2,
      2: 1,
    };
    try {
      const res = await frozenBatch({
        ids: record.id,
        status: status[record.status],
      });
      if (res.success) {
        message.success(res.message);
        action?.reload(true);
      } else {
        message.warning(res.message);
      }
    } catch (e) {
      console.log('e', e);
    }
  };
  return (
    <TableDropdown
      key="actionGroup"
      onSelect={handleSelect}
      menus={[
        { key: 'view', name: '详情' },
        { key: 'password', name: '修改密码' },
        {
          key: 'frozen',
          name: (
            <Popconfirm
              title={`确定${record.status === 1 ? '冻结' : '解冻'}吗?`}
              onConfirm={handleFrozen}
            >
              {record.status === 1 ? '冻结' : '解冻'}
            </Popconfirm>
          ),
        },
        {
          key: 'delete',
          name: (
            <Popconfirm title="确定要删除吗？" onConfirm={handleDel}>
              删除
            </Popconfirm>
          ),
        },
      ]}
    />
  );
};

const getList = (params) =>
  new Promise((resolve) => {
    request('/transaction/supplies/queryPage', {
      params: {
        ...params,
        pageNo: params.current,
      },
    }).then((res) => {
      resolve({
        data: res?.result?.records || [],
        total: res?.result?.total || 0,
      });
    });
  });

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
  }
};

const UserList = () => {
  const actionRef = useRef();
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const handleAdd = () => {
    dispatch({ type: 'add' });
  };
  return (
    <OperationContext.Provider value={{ dispatch, state, refresh: actionRef.current?.reload }}>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        editable={{ type: 'multiple' }}
        rowKey="id"
        search={true}
        request={getList}
        pagination={{
          pageSize: 10,
        }}
        options={false}
        dateFormatter="string"
        toolbar={{
          title: (
            <Space>
              <Button
                key="button"
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleAdd}
              >
                新建
              </Button>
            </Space>
          ),
        }}
      />
    </OperationContext.Provider>
  );
};

export default UserList;
