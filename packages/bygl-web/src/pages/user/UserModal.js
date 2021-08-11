import { useContext, useEffect, useRef, useState } from 'react';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { message } from 'antd';
import { request } from 'umi';

import { ProFormImageUpload } from '@ttyys/bs-marketization-web';
import { OperationContext } from './UserList';

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
  username: [{ required: true, message: '必填' }],
  password: [{ required: true, message: '必填' }],
  confirmpassword: [{ required: true, message: '必填' }],
  realname: [{ required: true, message: '必填' }],
  workNo: [{ required: true, message: '必填' }],
  post: [],
  selectedroles: [],
  selecteddeparts: [],
  userIdentity: [],
  departIds: [],
  avatar: [],
  birthday: [],
  sex: [],
  email: [],
  phone: [{ required: true, message: '必填' }],
  telephone: [],
};

const addObject = (data) =>
  request('/sys/user/add', {
    method: 'post',
    data,
  });

const editObject = (data) =>
  request('/sys/user/edit', {
    method: 'put',
    data,
  });

//初始化角色字典
const initRoleList = () => {
  return new Promise((resolve) => {
    request('/sys/role/queryall', {
      method: 'get',
    }).then((res) => {
      if (res && res.success) {
        resolve(
          res.result.map((item) => ({ label: item.roleName, value: item.id })),
        );
      } else {
        resolve([]);
      }
    });
  });
};
const getUserRoles = (userid) => {
  return new Promise((resolve) => {
    request('/sys/user/queryUserRole', {
      method: 'get',
      params: { userid: userid },
    }).then((res) => {
      if (res && res.success) {
        resolve(res.result);
      } else {
        resolve([]);
      }
    });
  });
};
const getUserDeparts = (userid) => {
  return new Promise((resolve) => {
    request('/sys/user/userDepartList', {
      method: 'get',
      params: { userId: userid },
    }).then((res) => {
      let departOptions = [];
      let selectDepartKeys = [];
      if (res && res.success) {
        const userDepartList = res.result;
        for (let i = 0; i < userDepartList.length; i++) {
          selectDepartKeys.push(userDepartList[i].key);
          //新增负责部门选择下拉框
          departOptions.push({
            value: userDepartList[i].key,
            label: userDepartList[i].title,
          });
        }
      }
      resolve({ departOptions, selectDepartKeys });
    });
  });
};

const titles = {
  add: '新增',
  edit: '编辑',
  view: '查看',
};

const UserModal = () => {
  const formRef = useRef();
  const [title, setTitle] = useState('');
  const mountedRef = useRef();
  const [visible, setVisible] = useState(false);
  const { refresh, state } = useContext(OperationContext);
  const [rolesOptions, setRolesOptions] = useState([]);
  const [nextDepartOptions, setNextDepartOptions] = useState([]);

  const onFinish = async (values) => {
    try {
      const res =
        state.type === 'edit'
          ? await editObject({ ...values, id: state?.record?.id })
          : await addObject(values);
      if (res.success) {
        formRef.current?.resetFields();
        setVisible(false);
        refresh();
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    const selected = {
      selectedroles: [],
      selecteddeparts: [],
    };
    const id = state?.record?.id;
    if (id && visible) {
      setHide(true);
      delete rules.password;
      delete rules.confirmpassword;
      getUserDeparts(id).then(({ departOptions, selectDepartKeys }) => {
        selected.selecteddeparts = selectDepartKeys;
        setNextDepartOptions(departOptions);
      });
      getUserRoles(id).then((res) => {
        selected.selectedroles = res;
      });
      formRef.current?.setFieldsValue({
        ...state.record,
        ...selected,
      });
    }
  }, [state.record, visible]);

  useEffect(() => {
    if (visible) {
      initRoleList().then((res) => {
        setRolesOptions(res);
      });
    }
  }, [rolesOptions.length, visible]);

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
        name="username"
        label="用户账号"
        rules={rules.username}
        readonly={state.type !== 'add'}
      />
      {state.type === 'add' && (
        <ProFormText.Password
          name="password"
          label="登录密码"
          rules={rules.password}
          readonly={state.type === 'view'}
        />
      )}
      {state.type === 'add' && (
        <ProFormText.Password
          name="confirmpassword"
          label="确认密码"
          rules={rules.confirmpassword}
          readonly={state.type === 'view'}
        />
      )}
      <ProFormText
        name="realname"
        label="用户姓名"
        rules={rules.realname}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="workNo"
        label="工号"
        rules={rules.workNo}
        readonly={state.type === 'view'}
      />
      <ProFormSelect
        name="post"
        label="职务"
        rules={rules.post}
        readonly={state.type === 'view'}
      />
      <ProFormSelect
        name="selectedroles"
        label="角色分配"
        rules={rules.selectedroles}
        options={rolesOptions}
        fieldProps={{ mode: 'multiple' }}
        readonly={state.type === 'view'}
      />
      <ProFormSelect
        name="selecteddeparts"
        label="部门分配"
        rules={rules.selecteddeparts}
        fieldProps={{ mode: 'multiple' }}
        readonly={state.type === 'view'}
      />
      <ProFormSelect
        name="userIdentity"
        label="身份"
        rules={rules.userIdentity}
        options={[
          { label: '普通用户', value: '1' },
          { label: '上级', value: '2' },
        ]}
        readonly={state.type === 'view'}
      />
      <ProFormDependency name={['userIdentity']}>
        {({ userIdentity }) => {
          if (userIdentity === '2') {
            return (
              <ProFormSelect
                name="departIds"
                label="负责部门"
                rules={rules.departIds}
                options={nextDepartOptions}
                readonly={state.type === 'view'}
              />
            );
          }
        }}
      </ProFormDependency>
      <ProFormImageUpload
        name="avatar"
        label="头像"
        max={1}
        listType={'picture-card'}
        rules={rules.avatar}
        readonly={state.type === 'view'}
      />
      <ProFormDatePicker
        name="birthday"
        label="生日"
        rules={rules.birthday}
        readonly={state.type === 'view'}
      />
      <ProFormRadio.Group
        name="sex"
        label="性别"
        rules={rules.sex}
        options={[
          { label: '男', value: '1' },
          { label: '女', value: '2' },
        ]}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="email"
        label="邮箱"
        rules={rules.email}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="phone"
        label="手机号码"
        rules={rules.phone}
        readonly={state.type === 'view'}
      />
      <ProFormText
        name="telephone"
        label="座机"
        rules={rules.telephone}
        readonly={state.type === 'view'}
      />
    </ModalForm>
  );
};

export default UserModal;
