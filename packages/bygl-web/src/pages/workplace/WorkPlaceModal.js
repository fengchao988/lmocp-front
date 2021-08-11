import React, { useRef, useEffect, useContext, useState } from 'react';
import { message, Row, Col, Input } from 'antd';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { request, inject, observer, stores } from 'umi';

import { TableContext } from './WorkPlaceList';
import { ProFormEditableProTable } from '@ttyys/bs-marketization-web';
import { BsSelect } from '@ttyys/bs-marketization-web';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const tableFormItemLayout = {
  labelCol: {
    sm: { span: 9 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};

// Todo 钊哥加校验
const rules = {
  name: {
    rules: [
      {
        required: true,
        message: '必填',
      },
    ],
  },
  typeName: {
    rules: [
      {
        required: true,
        message: '必选',
      },
    ],
  },
  options: {
    rules: [
      {
        type: 'array',
        required: true,
        message: '请添加作业条件参数',
      },
    ],
  },
};

const addParameter = (params) =>
  request('/llot-common/workplace/info/addBatch', {
    method: 'post',
    data: params,
  });

const columns = [
  {
    title: '参数',
    dataIndex: 'parameter',
    align: 'center',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
    render: (text) =>
      (
        stores.parameterSelectStore.dataSource.find((f) => f.value === text) ||
        {}
      ).label || '',
    renderFormItem: (_, { fieldProps }) => {
      return (
        <BsSelect
          multiply={true}
          bindPropPath="$.dataSource"
          bindStore="parameterSelectStore"
          {...fieldProps}
        />
      );
    },
  },
  {
    title: '数值',
    dataIndex: 'value',
    align: 'center',
    formItemProps: (form, config) => {
      let required = false;
      const parameter = form.getFieldValue([config.rowKey, 'parameter']);
      if (parameter) {
        const target = stores.parameterSelectStore.dataSource.find(
          (f) => f.value === parameter,
        );
        if (target && target.conditionType === 'REGULAR') {
          required = true;
        }
      }
      return {
        rules: [
          {
            required: required,
            message: required ? '必填' : '不必填',
          },
        ],
      };
    },
    renderFormItem: (
      _,
      { type, defaultRender, fieldProps, recordKey, ...restProps },
      form,
    ) => {
      const parameter = form.getFieldValue([recordKey, 'parameter']);
      if (parameter) {
        const target = stores.parameterSelectStore.dataSource.find(
          (f) => f.value === parameter,
        );
        if (target && target.conditionType === 'REGULAR') {
          return (
            <BsSelect
              multiply={true}
              bindPropPath="$.dataSource"
              bindStore="parameterOptionSelectStore"
              bindParamsPath="$.params"
              bindParams={{ conditionId: parameter }}
              {...fieldProps}
            />
          );
        }
      }
      return <Input placeholder="请输入" {...fieldProps} />;
    },
  },
];

const titles = {
  add: '新增',
  edit: '编辑',
  view: '删除',
};

const del = (id) =>
  request('/llot-common/workplace/info/delete', {
    method: 'delete',
    params: {
      id,
    },
  });

const WorkplaceModal = ({ workplaceTypeStore: { dataSource } }) => {
  const formRef = useRef();
  const mountedRef = useRef();
  const { refresh, state } = useContext(TableContext);
  const [title, setTitle] = useState('');
  const [visible, setVisible] = useState(false);
  const handleFinish = async (values) => {
    try {
      const options = values.options.map((item) => {
        const type = (
          stores.parameterSelectStore.dataSource.find(
            (f) => f.value === item.parameter,
          ) || {}
        ).conditionType;
        return item.isCreate
          ? {
              parameter: item.parameter,
              value: item.value,
              type,
            }
          : { ...item, type };
      });
      const res = await addParameter({
        ...values,
        options,
        id: state.type === 'add' ? undefined : state.record?.id,
      });
      if (res.success) {
        refresh();
        message.success(state.type === 'add' ? '添加成功' : '修改成功');
        setVisible(false);
      } else {
        message.error(state.type === 'add' ? '添加失败' : '修改失败');
      }
    } catch (e) {
      console.log('e', e);
      message.error(state.type === 'add' ? '添加失败' : '修改失败');
    }
  };

  const handleDel = (record) => del(record.id);

  useEffect(() => {
    if (mountedRef.current && ['add', 'edit', 'view'].includes(state.type)) {
      setTitle(titles[state.type]);
      setVisible(true);
      formRef.current?.setFieldsValue(state.record);
    }
  }, [state.record, state.depsFlag, state.type]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);
  return (
    <ModalForm
      title={title}
      formRef={formRef}
      visible={visible}
      modalProps={{
        onCancel: () => setVisible(false),
      }}
      layout="horizontal"
      {...formItemLayout}
      onFinish={handleFinish}
    >
      <Row style={{ paddingLeft: 24, paddingRight: 24 }}>
        <Col span={12}>
          <ProFormText label="工作地点" name="name" rules={rules.name.rules} />
        </Col>
        <Col span={12}>
          <ProFormSelect
            label="地点类型"
            name="type"
            options={dataSource}
            rules={rules.typeName.rules}
          />
        </Col>
      </Row>
      <div style={{ paddingLeft: 24, paddingRight: 24 }}>
        <span>
          <span style={{ color: 'red', marginRight: 5 }}>*</span>作业条件参数:
        </span>
      </div>
      <ProFormEditableProTable
        columns={columns}
        onDel={handleDel}
        name="options"
        {...tableFormItemLayout}
        rules={rules.options.rules}
      />
    </ModalForm>
  );
};

export default inject('workplaceTypeStore')(observer(WorkplaceModal));
