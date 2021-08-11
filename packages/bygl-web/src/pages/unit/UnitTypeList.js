import React, {useContext, useEffect, useRef, useState} from 'react';
import ProTable from '@ant-design/pro-table';
import { request } from 'umi';
import { Button, Popconfirm, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';

const delUnit = (id) =>
  request(`/llot-common/measure/unit_category/${id}`, {
    method: 'delete',
  });

const getUnitType = (params) =>
  new Promise((resolve) => {
    request('/llot-common/measure/unit_category/page', {
      params: {
        ...params,
        pageNo: params.current,
      },
    }).then((res) => {
      resolve({
        list: res?.result?.records || [],
        total: res?.result?.total || 0,
      });
    });
  });

const saveUnitType = (data) =>
  request('/llot-common/measure/unit_category/create', {
    method: 'post',
    data,
  });

const updateUnitType = data => request('/llot-common/measure/unit_category', {
  method: 'put',
  data,
});
const columns = [
  {
    title: '分类名称',
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
  const { refresh } =  useContext(TableContext);
  return <Popconfirm
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

const UnitTypeList = ({ onRowClick }) => {
  const [activeId, setActiveId] = useState(null);
  const actionRef = useRef();
  const mountedRef = useRef();
  const { tableProps, refresh } = useRequest(getUnitType, { paginated: true });
  const handleAdd = () => {
    actionRef.current?.addEditRecord({ id: Math.random(), isCreate: true });
  };
  const handleSave = async (key, data, row) => {
    try {
      const res = data.isCreate ? await saveUnitType(data) : await updateUnitType(data);
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
    if (mountedRef.current && !tableProps.dataSource.some(s => s.id === activeId)) {
      setActiveId(null);
      onRowClick && onRowClick({});
    }
  }, [tableProps.dataSource, activeId]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);
  return (
    <TableContext.Provider value={{ refresh }}>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        onRow={(reocord) => ({
          onClick: () => {
            if (!reocord.isCreate) {
              setActiveId(reocord.id);
              onRowClick && onRowClick(reocord);
            }
          },
          style: {
            backgroundColor: activeId === reocord.id ? '#e6f7ff' : '',
          },
        })}
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
                onClick={handleAdd}
              >
                分类
              </Button>
            </Space>
          ),
        }}
        {...tableProps}
      />
    </TableContext.Provider>
  );
};

export default UnitTypeList;
