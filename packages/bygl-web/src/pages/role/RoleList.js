import React, { useContext, useReducer, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Space } from 'antd';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { request } from 'umi';
import RoleModal from './RoleModal';
import { useImmerReducer } from 'use-immer';
import { useRequest } from 'ahooks';

import UserRoleModal from './UserRoleModal';

const columns = [
  {
    title: '角色编码',
    dataIndex: 'roleCode',
    width: 300,
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    hideInSearch: true,
  },
  {
    title: '操作',
    fixed: 'right',
    valueType: 'option',
    width: 150,
    render: (text, record, _, action) => [
      <OperationUser key="user" record={record} />,
      <OperationEdit key="edit" record={record} />,
      <OperationMore key="more" record={record} action={action} />,
    ],
  },
];

const deleteRequest = (id) =>
  request('/sys/role/delete', {
    method: 'delete',
    params: {
      id,
    },
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

const OperationUser = ({ record }) => {
  const { dispatch } = useContext(OperationContext);
  const handleUser = () => {
    dispatch({
      type: 'user',
      payload: record,
    });
  };
  return (
    <a key="user" onClick={handleUser}>
      用户
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
      const res = await deleteRequest(record.id);
      if (res.success) {
        action?.reload();
        message.success('删除成功');
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <TableDropdown
      key="actionGroup"
      onSelect={handleSelect}
      menus={[
        { key: 'view', name: '详情' },
        { key: 'permission', name: '授权' },
        // { key: 'add', name: '添加下级' },
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
    request('/sys/role/list', {
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
      break;
    case 'permission':
      draft.type = 'permission';
      draft.record = action.payload;
      draft.depsFlag = !draft.depsFlag;
  }
};

const RoleList = () => {
  const actionRef = useRef();
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const handleAdd = () => {
    dispatch({ type: 'add' });
  };
  return (
    <OperationContext.Provider value={{ dispatch, state, refresh: actionRef.current?.reload }}>
      <ProTable
        scroll={{ x: 1500 }}
        columns={columns}
        actionRef={actionRef}
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
                新建角色
              </Button>
            </Space>
          ),
        }}
      />
      <RoleModal />
      <UserRoleModal />
    </OperationContext.Provider>
  );
};

export default RoleList;
