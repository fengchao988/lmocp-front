import {useEffect, useRef, useState} from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from '@ant-design/pro-form';
import {message} from 'antd';
import {request} from 'umi';

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

const rules = {
  itemText: [{required: true, message: '必填'}],
  itemValue: [{required: true, message: '必填'}],
};

const addDict = (data) =>
  request('/sys/dictItem/add', {
    method: 'post',
    data,
  });

const editDict = (data) =>
  request('/sys/dictItem/edit', {
    method: 'put',
    data,
  });

const Modal = ({visible, type, record, title, onClose, ...restProps}) => {
  const typeRef = useRef();
  const closeRef = useRef();
  const formRef = useRef();
  const recordRef = useRef();

  typeRef.current = type;
  recordRef.current = record;
  closeRef.current = onClose;
  console.log('record===', record);

  const onFinish = (values) => {
    try {
      typeRef.current === 'edit'
        ? editDict({...values, id: recordRef.current?.id})
        : addDict({...values, dictId: recordRef.current?.dictId});
      formRef.current?.resetFields();
      if (closeRef.current) {
        closeRef.current();
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    formRef.current?.setFieldsValue(record);
  }, [record]);
  return (
    <ModalForm
      formRef={formRef}
      title={title}
      visible={visible}
      modalProps={{
        ...restProps,
        onCancel: onClose,
      }}
      layout="horizontal"
      rules={rules}
      {...formItemLayout}
      onFinish={onFinish}
      submitter={{
        submitButtonProps: {
          style: {
            display: type === 'view' ? 'none' : 'block',
          },
        },
      }}
    >
      <ProFormText
        name="itemText"
        label="名称"
        rules={rules.itemText}
        readonly={type === 'view'}
      />
      <ProFormText
        name="itemValue"
        label="数据值"
        rules={rules.itemValue}
        readonly={type === 'view'}
      />
      <ProFormTextArea
        name="description"
        label="描述"
        readonly={type === 'view'}
      />
    </ModalForm>
  );
};

export default Modal;
