import React, {useContext, useReducer, useRef} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Button, message, Popconfirm, Space} from 'antd';
import ProTable, {TableDropdown} from '@ant-design/pro-table';
import {request} from 'umi';
import Modal from './Modal';
import ItemList from './item';

const columns = [
  {
    title: '字典名称',
    align: "left",
    dataIndex: 'dictName',
  },
  {
    title: '字典编号',
    align: "left",
    dataIndex: 'dictCode',
  },
  {
    title: '描述',
    align: "left",
    dataIndex: 'description',
    hideInSearch: true,
  },
  {
    title: '操作',
    fixed: 'right',
    valueType: 'option',
    width: 150,
    render: (text, record, _, action) => [
      <OperationEdit key="edit" record={record}/>,
      <ItemListConfig key="itemList" record={record}/>,
      <OperationMore key="more" record={record} action={action}/>
    ]
  }
];

const deleteRequest = (id) => request('/sys/dict/delete', {
  method: 'delete',
  params: {
    id
  }
});

const OperationContext = React.createContext(null);

const OperationEdit = ({record}) => {
  const recordRef = useRef();
  recordRef.current = record;
  const {dispatch} = useContext(OperationContext);
  const handleEdit = () => {
    dispatch({
      type: 'edit',
      payload: {
        record: recordRef.current,
        visible: true,
      },
    });
  };
  return (
    <a key="edit" onClick={handleEdit}>编辑</a>
  );
};
const ItemListConfig = ({record}) => {
  const recordRef = useRef();
  recordRef.current = record;
  const {itemDispatch} = useContext(OperationContext);
  const handleConfig = () => {
    itemDispatch({
      type: 'itemList',
      payload: {
        visible: true,
        record: recordRef.current,
      }
    });
  };
  return (
    <a key="edit" onClick={handleConfig}>字典配置</a>
  );
};

const OperationMore = ({record, action}) => {
  const recordRef = useRef();
  recordRef.current = record;
  const {dispatch} = useContext(OperationContext);
  const handleSelect = (key) => {
    if (key === 'add') {
      dispatch({
        type: 'add',
        payload: {
          visible: true,
          record: {}
        }
      });
    } else if (key === 'detail') {
      dispatch({
        type: 'view',
        payload: {
          visible: true,
          record: recordRef.current,
        }
      });
    }
  };

  const handleDel = async () => {
    try {
      await deleteRequest(recordRef.current?.id);
      action.current?.reload();
      message.success('删除成功');
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <TableDropdown
      key="actionGroup"
      onSelect={handleSelect}
      menus={[
        {key: 'detail', name: '详情'},
        {
          key: 'delete',
          name: (
            <Popconfirm title="确定要删除吗？" onConfirm={handleDel}>删除</Popconfirm>
          )
        }
      ]}
    />
  );
};

const getList = (params) =>
  request('/sys/dict/list', {
    params: {
      ...params,
      pageNo: params.current,
    },
  });

const initialState = {
  visible: false,
  record: null,
  type: 'add',
  title: '添加',
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        type: 'add',
        title: '添加',
        ...action.payload,
      };
    case 'edit':
      return {
        ...state,
        type: 'edit',
        title: '编辑',
        ...action.payload,
      };
    case 'view':
      return {
        ...state,
        type: 'view',
        title: '详情',
        ...action.payload,
      };
  }
};
const initialItemState = {
  visible: false,
  record: null,
  title: '添加',
};
const itemReducer = (state, action) => {
  if (action.type === 'itemList') {
    return {
      ...state,
      type: 'itemList',
      title: '字典配置',
      ...action.payload,
    };
  }
};


const ObjectList = () => {
  const actionRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [itemState, itemDispatch] = useReducer(itemReducer, initialItemState);
  const handleToggleVisible = (v) => () => {
    dispatch({
      type: 'add',
      payload: {
        record: null,
        visible: v,
      },
    });
  };

  const handleClose = () => {
    dispatch({
      type: 'add',
      payload: {
        record: null,
        visible: false,
      },
    });
    actionRef.current?.reload();
  };
  const closeItemList = () => {
    itemDispatch({
      type: 'itemList',
      payload: {
        record: null,
        visible: false,
      },
    });
  };
  return (
    <OperationContext.Provider value={{dispatch, itemDispatch, state}}>
      <ProTable
        scroll={{x: 1500}}
        columns={columns}
        actionRef={actionRef}
        editable={{type: 'multiple'}}
        rowKey="id"
        search={true}
        pagination={{
          pageSize: 10,
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          try {
            const res = await getList(params);
            console.log(res)
            return Promise.resolve({
              data: res.result.records,
              total: res.result.total,
              success: true
            });
          } catch (e) {
            console.log('e', e);
          }
        }}
        options={false}
        dateFormatter="string"
        toolbar={{
          title: (
            <Space>
              <Button key="button" icon={<PlusOutlined/>} type="primary"
                      onClick={handleToggleVisible(true)}>新建</Button>
            </Space>
          )
        }}
      />
      <Modal {...state} onClose={handleClose}/>
      <ItemList {...itemState} onClose={closeItemList}/>
    </OperationContext.Provider>
  );
};

export default ObjectList;
