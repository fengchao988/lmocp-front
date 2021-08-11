import { useContext, useEffect, useRef, useState } from 'react';
import ProFrom, {
  ModalForm,
  ProFormText,
  ProFormDependency,
} from '@ant-design/pro-form';
import { message } from 'antd';
import { request } from 'umi';
import { TableContext } from './ParameterList';
import ParameterTypeSelect from './ParameterType/ParameterTypeSelect';
import UnitTreeSelect from './UnitTreeSelect';

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

const rules = {
  name: [{ required: true, message: '必填' }],
  code: [{ required: true, message: '必填' }],
  conditionType: [{ required: true, message: '必填' }],
};

const addParameter = (data) =>
  request('/llot-common/workplace/condition/make', {
    method: 'post',
    data,
  });

const editParameter = (data) =>
  request(`/llot-common/workplace/condition/modify_info/${data.id}`, {
    method: 'put',
    data,
  });

const titles = {
  add: '新增',
  edit: '编辑',
  view: '查看',
};

const ParameterModal = () => {
  const formRef = useRef();
  const [title, setTitle] = useState('');
  const mountedRef = useRef();
  const [visible, setVisible] = useState(false);
  const { state, refresh } = useContext(TableContext);

  const onFinish = async (values) => {
    try {
      const res =
        state.type === 'edit'
          ? await editParameter({ ...values, id: state?.record?.id })
          : await addParameter(values);
      if (res.success) {
        formRef.current?.resetFields();
        message.success(res.message);
        setVisible(false);
        refresh();
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

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
      formRef={formRef}
      title={title}
      visible={visible}
      modalProps={{
        onCancel: () => setVisible(false),
      }}
      layout="horizontal"
      rules={rules}
      {...formItemLayout}
      onFinish={onFinish}
      submitter={{
        submitButtonProps: {
          style: {
            display: state.type === 'view' ? 'none' : 'block',
          },
        },
      }}
    >
      <ProFormText
        name="name"
        label="作业条件"
        rules={rules.name}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="code"
        label="条件编码"
        rules={rules.code}
        readonly={state.type === 'view' || state.type === 'edit'}
      />
      <ParameterTypeSelect
        name="conditionType"
        label="参数值类型"
        rules={rules.conditionType}
        readonly={state.type === 'view'}
      />
      <ProFormDependency name={['conditionType']}>
        {({ conditionType }) => {
          return (
            <ProFrom.Item
              name="measuringUnitId"
              valuePropName="measuringUnitId"
              label="计量单位"
              rules={[
                {
                  required: conditionType === 'RANGE',
                  message: '请选择',
                },
              ]}
            >
              <UnitTreeSelect
                placeholder="请选择"
                readonly={state.type === 'view'}
              />
            </ProFrom.Item>
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
};

export default ParameterModal;
