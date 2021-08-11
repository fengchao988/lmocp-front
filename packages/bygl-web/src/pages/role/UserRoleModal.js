import React, { useContext, useEffect, useRef, useState } from 'react';
import { message, Tree } from 'antd';
import ProForm, { DrawerForm } from '@ant-design/pro-form';
import { request, useMst } from 'umi';
import { OperationContext } from './RoleList';
import RoleTree from './RoleTree';

const saveRolePermission = (data) =>
  request('/sys/permission/saveRolePermission', {
    method: 'post',
    data,
  });
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

const UserRoleModal = () => {
  const formRef = useRef();
  const mountedRef = useRef();
  const { state, refresh } = useContext(OperationContext);
  const loginStore = useMst(state => state.loginStore);
  const [visible, setVisible] = useState(false);
  const onFinish = async (values) => {
    try {
      console.log("values....", values);
      const res = await saveRolePermission({
        permissionIds: values?.permissionIds?.join(','),
        roleId: state?.record?.id,
      });
      if (res.success) {
        message.success(res.message);
        formRef.current?.resetFields();
        loginStore.queryPermissionByUser(false);
        refresh();
        setVisible(false);
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    if (mountedRef.current && ['permission'].includes(state.type)) {
      setVisible(true);
      formRef.current?.setFieldsValue(state.record);
      console.log("state.reocrd", state.record, formRef.current?.getFieldsValue())
    }
  }, [state.record, state.depsFlag, state.type]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);
  return (
    <DrawerForm
      formRef={formRef}
      title="角色权限配置"
      visible={visible}
      layout="horizontal"
      initialValues={{
        menuType: 0,
      }}
      drawerProps={{
        onClose: () => setVisible(false)
      }}
      {...formItemLayout}
      onFinish={onFinish}
    >
      <ProForm.Item name="permissionIds" valuePropName="permissionIds">
        <RoleTree roleId={state?.record?.id} />
      </ProForm.Item>
    </DrawerForm>
  );
};

export default UserRoleModal;
