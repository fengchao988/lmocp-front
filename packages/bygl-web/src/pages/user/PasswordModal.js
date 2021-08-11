import { useRef, useEffect } from 'react';
import { message } from 'antd';
import { ModalForm, ProFormText,  } from '@ant-design/pro-form';
import { request } from 'umi';

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 5},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};

// Todo 钊哥加校验
const rules = {
  password:{
    rules: [{
      required: true,
      pattern:/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
      message: '密码由8位数字、大小写字母和特殊符号组成!'
    }],
  },
  confirmpassword:{
    rules: [{
      required: true, message: '请重新输入登录密码!',
    }],
  },
}

const changePassword = (params) => request('/sys/user/changePassword', {
  method: 'put',
  data: params,
})

const PasswordModal = ({ visible, onClose, record }) => {
  const formRef = useRef();
  const handleFinish = async(values) => {
    try {
      await changePassword({...values,...record});
      message.success('修改成功');
      if(onClose) {
        onClose();
      }
    }catch (e) {
      console.log('e', e);
      message.error('修改失败');
    }
  }

  useEffect(() => {
    formRef.current?.setFieldsValue(record);
  }, [record]);
  return <ModalForm
    title="修改密码"
    formRef={formRef}
    visible={visible}
    modalProps={{
      onCancel: onClose,
    }}
    layout="horizontal"
    {...formItemLayout}
    onFinish={handleFinish}
  >
    <ProFormText label="用户账号" name="username" readonly/>
    <ProFormText.Password label="登录密码" name="password" rules={rules.password.rules}/>
    <ProFormText.Password label="确认密码" name="password" rules={rules.confirmpassword.rules}/>
  </ModalForm>
}

export default PasswordModal;
