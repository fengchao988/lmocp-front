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
  dictName: [{required: true, message: '必填'}],
  dictCode: [{required: true, message: '必填'}],
};

const addDict = (data) =>
  request('/sys/dict/add', {
    method: 'post',
    data,
  });

const editDict = (data) =>
  request('/sys/dict/edit', {
    method: 'put',
    data,
  });

const Modal = ({visible, type, record, title, onClose, ...restProps}) => {
  const typeRef = useRef();
  const closeRef = useRef();
  const formRef = useRef();
  const recordRef = useRef();
  const [disable, setDisable] = useState(false);

  typeRef.current = type;
  recordRef.current = record;
  closeRef.current = onClose;

  const onFinish = (values) => {
    try {
      typeRef.current === 'edit'
        ? editDict({...values, id: recordRef.current?.id})
        : addDict(values);
      formRef.current?.resetFields();
      if (closeRef.current) {
        closeRef.current();
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    if (record?.id) {
      setDisable(true);
    }
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
        name="dictName"
        label="字典名称"
        rules={rules.dictName}
        readonly={type === 'view'}
      />
      <ProFormText
        name="dictCode"
        label="字典编码"
        rules={rules.dictCode}
        readonly={type === 'view' || disable}
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
