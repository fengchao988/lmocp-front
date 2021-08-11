import React, { useContext, useReducer, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Popconfirm, message } from 'antd';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { request } from 'umi';
import * as Icons from '@ant-design/icons';
import PermissionMenuModal from './PermissionMenuModal';
import {useImmerReducer} from "use-immer";
import {useRequest} from "ahooks";

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    width: 300,
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
    onFilter: true,
    valueType: 'select',
    initialValue: 0,
    valueEnum: {
      0: { text: '一级菜单', status: 0 },
      1: {
        text: '子菜单',
        status: 1,
      },
      2: {
        text: '按钮/权限',
        status: 2,
      },
    },
  },
  {
    title: '图标',
    dataIndex: 'icon',
    render: text => {
      if (text && Icons[text]) {
        const IconComp = Icons[text];
        return <IconComp style={{ fontSize: 20 }}/>
      }
      return '-';
    },
  },
  {
    title: '路径',
    dataIndex: 'url',
  },
  {
    title: '组件',
    dataIndex: 'component',
  },
  {
    title: '排序',
    dataIndex: 'sortNo',
  },
  {
    title: '操作',
    fixed: 'right',
    valueType: 'option',
    width: 150,
    render: (text, record, _, action) => [
      <OperationEdit key="edit" record={record} />,
      <OperationMore key="more" record={record} action={action} />,
    ],
  },
];

const deleteRequest = (id) => request('/sys/permission/delete', {
  method: 'delete',
  params: {
    id
  }
});

export const OperationContext = React.createContext(null);

const OperationEdit = ({ record }) => {
  const { dispatch } = useContext(OperationContext);
  const handleEdit = () => {
    dispatch({ type: 'edit', payload: record})
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
    try{
      const res = await deleteRequest(record.id);
      if (res.success) {
        action?.reload();
        message.success('删除成功');
      } else {
        message.error(res.message);
      }
    }catch (e) {
      message.error(e.message);
    }
  };
  return (
    <TableDropdown
      key="actionGroup"
      onSelect={handleSelect}
      menus={[
        { key: 'view', name: '详情' },
        { key: 'subAdd', name: '添加下级' },
        {
          key: 'delete',
          name: (
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={handleDel}
            >
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
    request('/sys/permission/list', {
      params: {
        ...params,
        pageNo: params.current,
      },
    }).then((res) => {
      resolve({
        data: res?.result || [],
      });
    });
  });


const initialState = {
  record: {},
  type: null,
  depsFlag: false,
};

const reducer = (draft, action) => {
  console.log('action', action);
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
    case 'subAdd':
      draft.type = 'subAdd';
      draft.record = action.payload;
      draft.depsFlag = !draft.depsFlag;
      break;
  }
};

const PermissionMenu = () => {
  const actionRef = useRef();
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const handleAdd = () => {
    dispatch({ type: 'add' });
  };
  return (
    <>
      <OperationContext.Provider value={{ dispatch, state, refresh: actionRef.current?.reload }}>
        <ProTable
          scroll={{ x: 1500 }}
          columns={columns}
          actionRef={actionRef}
          rowKey="id"
          search={false}
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
        <PermissionMenuModal />
      </OperationContext.Provider>
    </>
  );
};

export default PermissionMenu;
