import React, { useContext, useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { request, stores } from 'umi';
import { Button, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useImmerReducer } from 'use-immer';
import WorkPlaceModal from './WorkPlaceModal';
import { BsSelect } from '@ttyys/bs-marketization-web';

const del = (id) =>
  request('/llot-common/workplace/info/delete', {
    method: 'delete',
    params: {
      id,
    },
  });

const getList = (params) =>
  new Promise((resolve) => {
    request('/llot-common/workplace/info/list', {
      params: {
        ...params,
        type: params.typeName,
        pageNo: params.current,
      },
    }).then((res) => {
      resolve({
        data: (res?.result?.records || []).map((item) => ({
          ...item,
          optionsValue: item.options
            ? item.options.map((o) => `${o.parameterName}:${o.value}`).join(',')
            : '',
        })),
        total: res?.result?.total || 0,
      });
    });
  });

const columns = [
  {
    title: '工作地点',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '工作地点类型',
    dataIndex: 'typeName',
    align: 'center',
    formItemProps: {
      labelCol: {
        sm: { span: 9 },
      },
      wrapperCol: {
        sm: { span: 24 },
      },
    },
    renderFormItem: (_, { fieldProps }) => {
      return (
        <BsSelect
          multiply={true}
          bindPropPath="$.dataSource"
          bindStore="workplaceTypeStore"
          {...fieldProps}
        />
      );
    },
  },
  {
    title: '作业条件',
    dataIndex: 'optionsValue',
    align: 'center',
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    align: 'center',
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

const WorkPlaceList = () => {
  const actionRef = useRef();
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const handleAdd = () => {
    dispatch({ type: 'add' });
  };
  useEffect(() => {
    stores.workplaceTypeStore.fetchData();
    stores.parameterSelectStore.fetchData();
  }, []);
  return (
    <TableContext.Provider
      value={{ state, dispatch, refresh: actionRef.current?.reload }}
    >
      <ProTable
        options={false}
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        editable={{ type: 'single' }}
        request={getList}
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
                新增
              </Button>
            </Space>
          ),
        }}
      />
      <WorkPlaceModal />
    </TableContext.Provider>
  );
};

export default WorkPlaceList;
