import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import ProTable from '@ant-design/pro-table';
import { request } from 'umi';
import { Button, Popconfirm, Space, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';

const delUnit = (id) =>
  request(`/llot-common/measure/unit/${id}`, {
    method: 'delete',
  });

const getUnit = (typeId) => (params) =>
  new Promise((resolve) => {
    request('/llot-common/measure/unit/page', {
      params: {
        ...params,
        categoryId: typeId,
        pageNo: params.current,
      },
    }).then((res) => {
      resolve({
        list: res?.result?.records || [],
        total: res?.result?.total || 0,
      });
    });
  });

const saveUnit = (data) =>
  request('/llot-common/measure/unit', {
    method: 'post',
    data,
  });

const updateUnit = (data) =>
  request('/llot-common/measure/unit', {
    method: 'put',
    data,
  });

const columns = [
  {
    title: '单位名称',
    dataIndex: 'name',
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
    title: '符号',
    dataIndex: 'symbol',
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
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
     <OptionDel record={record}/>,
    ],
  },
];

const OptionDel = ({ record }) => {
  const { refresh } = useContext(TableContext);
  return  <Popconfirm
    title="确定要删除吗？"
    onConfirm={async () => {
      try {
        const res = await delUnit(record.id);
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
}

const TableContext = React.createContext(null);

const UnitList = ({ typeId }) => {
  const actionRef = useRef();
  const editKeyRef = useRef();
  const mountedRef = useRef();
  const { tableProps, refresh } = useRequest(getUnit(typeId), {
    paginated: true,
    refreshDeps: [typeId],
  });
  const handleAdd = useCallback(() => {
    editKeyRef.current = Math.random();
    actionRef.current?.addEditRecord({ id: editKeyRef.current, isCreate: true });
  }, []);
  const handleSave = async (key, data, row) => {
    try {
      const res = data.isCreate
        ? await saveUnit({ ...data, categoryId: typeId })
        : await updateUnit({ ...data, categoryId: typeId });
      if (res.success) {
        message.success(res.message);
        refresh();
      } else {
        message.error(res.message);
      }
    } catch (e) {
      console.log('e', e);
      message.error(e.message);
    }
  };
  useEffect(() => {
    if (mountedRef.current && editKeyRef.current) {
      actionRef.current?.cancelEditable(editKeyRef.current);
      editKeyRef.current = null;
    }
  }, [typeId]);
  useEffect(() => {
    mountedRef.current = true;
  }, []);
  return (
    <TableContext.Provider value={{ refresh }}>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        editable={{
          type: 'single',
          onSave: handleSave,
          actionRender: (row, config, defaultDom) => [
            defaultDom.save,
            defaultDom.cancel,
          ],
        }}
        options={false}
        search={false}
        toolbar={{
          title: (
            <Space>
              <Button
                key="button"
                icon={<PlusOutlined />}
                type="primary"
                disabled={!typeId}
                onClick={handleAdd}
              >
                新增
              </Button>
            </Space>
          ),
        }}
        {...tableProps}
      />
    </TableContext.Provider>
  );
};

export default UnitList;
