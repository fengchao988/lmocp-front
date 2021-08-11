import {useContext, useEffect, useRef, useState} from 'react';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { message } from 'antd';
import { request } from 'umi';
import { OperationContext } from './RoleList';

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
  roleCode: [{ required: true, message: '必填' }],
  roleName: [{ required: true, message: '必填' }],
};

const addRole = (data) =>
  request('/sys/role/add', {
    method: 'post',
    data,
  });

const editRole = (data) =>
  request('/sys/role/edit', {
    method: 'put',
    data,
  });

const titles = {
  add: '新增',
  edit: '编辑',
  view: '查看',
};

const RoleModal = () => {
  const formRef = useRef();
  const [title, setTitle] = useState('');
  const mountedRef = useRef();
  const [visible, setVisible] = useState(false);
  const { state, refresh } = useContext(OperationContext);

  const onFinish = async (values) => {
    try {
      const res = state.type === 'edit'
        ? await editRole({ ...values, id: state?.record?.id })
        : await addRole(values);
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
      formRef.current?.resetFields();
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
        name="roleCode"
        label="角色编码"
        rules={rules.roleCode}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="roleName"
        label="角色名称"
        rules={rules.roleName}
        readonly={state.type === 'view'}
      />
      <ProFormTextArea
        name="description"
        label="角色描述"
        readonly={state.type === 'view'}
      />
    </ModalForm>
  );
};

export default RoleModal;
