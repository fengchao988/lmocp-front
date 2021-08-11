import React, { useContext, useEffect, useRef, useState } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import { message, Popconfirm } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { request } from 'umi';
import { TableContext } from './ParameterList';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const AddParameterTableContext = React.createContext(null);

const getConditionList = (conditionId) =>
  request('/llot-common/workplace/condition_value/condition_value_list', {
    method: 'get',
    params: {
      conditionId,
    },
  });

const delCondition = (data) =>
  request(`/llot-common/workplace/condition_value/delete/${data.id}`, {
    method: 'delete',
    data,
  });

const saveCondition = (data) =>
  request('/llot-common/workplace/condition_value/make', {
    method: 'post',
    data,
  });
const updateCondition = (data) =>
  request(`/llot-common/workplace/condition_value/modify_info/${data.id}`, {
    method: 'put',
    data,
  });

const columns = [
  {
    title: '参数名称',
    dataIndex: 'value',
    align: 'center',
  },
  {
    title: '值',
    dataIndex: 'code',
    align: 'center',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 100,
    align: 'center',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <OptionDel record={record} />,
    ],
  },
];

const OptionDel = ({ record }) => {
  const { refresh } = useContext(AddParameterTableContext);
  return (
    <Popconfirm
      title="确定要删除吗？"
      onConfirm={async () => {
        try {
          const res = await delCondition({ conditionId: record.conditionId, id: record.id });
          if (res.success) {
            message.success(res.message);
            refresh(record.conditionId);
          } else {
            message.error(res.message);
          }
        } catch (e) {
          console.log('e', e);
        }
      }}
    >
      <a>删除</a>
    </Popconfirm>
  );
};

const waitTime = (number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, number);
  });
};

const ParameterModal = () => {
  const mountedRef = useRef();
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [visible, setVisible] = useState(false);
  const { state } = useContext(TableContext);
  const [dataSource, setDataSource] = useState([]);
  const handleRefreshLocal = (id) => {
    getConditionList(id).then((res) => {
      setDataSource(res.result);
    });
  };

  const handleSave = async (rowKey, data, row) => {
    try {
      const values = {
        name: data.value,
        conditionId: state?.record?.id,
        code: data.code,
      };
      const res = data.isCreate
        ? await saveCondition(values)
        : await updateCondition({ ...values, id: data.id });
      if (res.success) {
        message.success(res.message);
        handleRefreshLocal(state?.record?.id);
      } else {
        message.error(res.message);
      }
    } catch (e) {
      console.log('e', e);
    }
    await waitTime(500);
  };
  const handleChange = (data) => {};

  const handleDel = async (key, row) => {
    try {
      const res = await delCondition(row);
      if (res.success) {
        message.success(res.message);
        handleRefreshLocal(row.conditionId);
      } else {
        message.error(res.message);
      }
    } catch (e) {
      console.log('e', e);
    }
  };
  useEffect(() => {
    if (
      mountedRef.current &&
      ['parameter'].includes(state.type) &&
      state?.record?.id
    ) {
      setVisible(true);
      handleRefreshLocal(state?.record?.id);
    }
  }, [state.type, state.record, state.depsFlag]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  return (
    <ModalForm
      title="条件参数维护"
      visible={visible}
      modalProps={{
        onCancel: () => setVisible(false),
      }}
      layout="horizontal"
      {...formItemLayout}
      submitter={{
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
    >
      <AddParameterTableContext.Provider
        value={{ dataSource, setDataSource, refresh: handleRefreshLocal }}
      >
        <EditableProTable
          rowKey="id"
          recordCreatorProps={{
            record: () => ({ id: Math.random(), isCreate: true }),
          }}
          value={dataSource}
          onChange={handleChange}
          columns={columns}
          editable={{
            onSave: handleSave,
            editableKeys,
            onDelete: handleDel,
            onChange: setEditableRowKeys,
            actionRender: (row, config, defaultDom) => [
              defaultDom.save,
              defaultDom.cancel,
            ],
          }}
        />
      </AddParameterTableContext.Provider>
    </ModalForm>
  );
};

export default ParameterModal;
