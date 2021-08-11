import { useContext, useEffect, useRef, useState } from 'react';
import ProForm, {
  DrawerForm,
  ProFormRadio,
  ProFormText,
  ProFormDigit,
  ProFormSwitch,
} from '@ant-design/pro-form';
import { message } from 'antd';
import { request, useMst } from 'umi';

import IconPanel from './IconPanel';
import { OperationContext } from './PermissionList';

const menuTypes = [
  {
    label: '一级菜单',
    value: 0,
  },
  {
    label: '子菜单',
    value: 1,
  },
  {
    label: '按钮/权限',
    value: 2,
  },
];

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
  name: [
    {
      required: true,
      message: '必填',
    },
  ],
  url: [
    {
      required: true,
      message: '必填',
    },
  ],
  component: [
    {
      required: true,
      message: '必填',
    },
  ],
};

const addPermission = (data) =>
  request('/sys/permission/add', {
    method: 'post',
    data,
  });

const editPermission = (data) =>
  request('/sys/permission/edit', {
    method: 'put',
    data,
  });

const titles = {
  add: '新增',
  edit: '编辑',
  view: '查看',
  subAdd: '新增',
};

const PermissionMenuModal = () => {
  const formRef = useRef();
  const { state, refresh } = useContext(OperationContext);
  const [title, setTitle] = useState('');
  const [visible, setVisible] = useState(false);
  const loginStore = useMst((state) => state.loginStore);
  const mountedRef = useRef();

  const onFinish = async (values) => {
    try {
      const res =
        state.type === 'edit'
          ? await editPermission({ ...values, id: state?.record?.id })
          : await addPermission(
              state.type === 'subAdd'
                ? { ...values, parentId: state?.record?.id }
                : values,
            );
      if (res.success) {
        formRef.current?.resetFields();
        message.success(res.message);
        refresh();
        loginStore.queryPermissionByUser(false);
        setVisible(false);
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    if (
      mountedRef.current &&
      ['add', 'view', 'edit', 'subAdd'].includes(state.type)
    ) {
      setVisible(true);
      setTitle(titles[state.type]);
      formRef.current?.setFieldsValue(
        state.type === 'subAdd' ? { menuType: 1 } : state.record,
      );
    }
  }, [state.record, state.depsFlag, state.type]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);
  return (
    <DrawerForm
      formRef={formRef}
      title={title}
      visible={visible}
      drawerProps={{
        onClose: () => setVisible(false),
      }}
      layout="horizontal"
      rules={rules}
      initialValues={{
        menuType: 0,
      }}
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
      <ProFormRadio.Group
        name="menuType"
        label="菜单类型"
        options={menuTypes}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="name"
        label="菜单名称"
        rules={rules.name}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="url"
        label="菜单路径"
        rules={rules.url}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="component"
        label="前端组件"
        rules={rules.component}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="redirect"
        label="默认跳转地址"
        readonly={state.type === 'view'}
      />
      <ProForm.Item name="icon" label="菜单图标">
        <IconPanel />
      </ProForm.Item>
      <ProFormDigit
        name="sortNo"
        label="排序"
        readonly={state.type === 'view'}
      />
      <ProFormSwitch
        name="route"
        label="是否路由菜单"
        checkedChildren="是"
        unCheckedChildren="否"
        readonly={state.type === 'view'}
      />
      <ProFormSwitch
        name="hidden"
        label="隐藏路由"
        checkedChildren="是"
        unCheckedChildren="否"
        readonly={state.type === 'view'}
      />
      <ProFormSwitch
        name="keepAlive"
        label="是否缓存路由"
        checkedChildren="是"
        unCheckedChildren="否"
        readonly={state.type === 'view'}
      />
      <ProFormSwitch
        name="alwaysShow"
        label="聚合路由"
        checkedChildren="是"
        unCheckedChildren="否"
        readonly={state.type === 'view'}
      />
      <ProFormSwitch
        name="internalOrExternal"
        label="打开方式"
        checkedChildren="外部"
        unCheckedChildren="内部"
        readonly={state.type === 'view'}
      />
    </DrawerForm>
  );
};

export default PermissionMenuModal;
