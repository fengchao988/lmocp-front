import React, { useContext, useReducer, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Space } from 'antd';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { request } from 'umi';
import UserModal from './UserModal';
import PasswordModal from './PasswordModal';
import { useImmerReducer } from 'use-immer';

const columns = [
  {
    title: '用户账号',
    align: 'center',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '用户姓名',
    align: 'center',
    width: 100,
    dataIndex: 'realname',
  },
  {
    title: '头像',
    align: 'center',
    width: 120,
    dataIndex: 'avatar',
    hideInSearch: true,
    render: (text) => (text ? <img src={text} width={30} height={30} /> : '-'),
  },

  {
    title: '性别',
    align: 'center',
    width: 80,
    dataIndex: 'sex',
    valueType: 'radio',
    hideInSearch: true,
    valueEnum: {
      1: {
        text: '男',
        status: 1,
      },
      2: {
        text: '女',
        status: 2,
      },
    },
  },
  {
    title: '生日',
    align: 'center',
    width: 150,
    dataIndex: 'birthday',
    hideInSearch: true,
  },
  {
    title: '手机号码',
    align: 'center',
    width: 100,
    dataIndex: 'phone',
  },
  {
    title: '部门',
    align: 'center',
    width: 180,
    dataIndex: 'orgCodeTxt',
    hideInSearch: true,
  },
  {
    title: '负责部门',
    align: 'center',
    width: 180,
    dataIndex: 'departIds_dictText',
    hideInSearch: true,
  },
  {
    title: '状态',
    align: 'center',
    width: 80,
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      1: {
        text: '正常',
        status: 1,
      },
      2: {
        text: '冻结 ',
        status: 2,
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    align: 'center',
    width: 150,
    render: (text, record, _, action) => [
      <OperationEdit key="edit" record={record} />,
      <OperationMore key="more" record={record} action={action} />,
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
    request('/sys/user/list', {
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
      <UserModal />
      <PasswordModal />
    </OperationContext.Provider>
  );
};

export default UserList;
