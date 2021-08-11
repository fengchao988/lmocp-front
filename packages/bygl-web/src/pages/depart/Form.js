import {useEffect, useRef, useState} from 'react';
import ProForm, {ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-form';
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
  departName: [{required: true, message: '必填'}],
  parentId: [],
  orgCode: [{required: true, message: '必填'}],
  departOrder: [{required: true, message: '必填'}],
  mobile: [],
  fix: [],
  address: [],
  memo: []
};

const addObject = (data) =>
  request('/sys/sysDepart/add', {
    method: 'post',
    data,
  });

const editObject = (data) =>
  request('/sys/sysDepart/edit', {
    method: 'put',
    data,
  });

const queryDepartTree = () => {
  return new Promise(resolve => {
    request('/sys/sysDepart/queryIdTree', {
      method: 'get'
    }).then((res) => {
      if (res && res.success) {
        resolve(res.result.map(item => ({label: item.title, value: item.value})));
      } else {
        resolve([]);
      }
    });
  });
};

const Form = ({type, record, title, onClose, ...restProps}) => {
  const typeRef = useRef();
  const closeRef = useRef();
  const formRef = useRef();
  const recordRef = useRef();
  const [departTree, setDepartTree] = useState([]);
  const [disable, setDisable] = useState(false);

  typeRef.current = type;
  recordRef.current = record;
  closeRef.current = onClose;

  const onFinish = (values) => {
    try {
      typeRef.current === 'edit'
        ? editObject({...values, id: recordRef.current?.id})
        : addObject(values);
      formRef.current?.resetFields();
      if (closeRef.current) {
        closeRef.current();
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    if (departTree?.length === 0) {
      queryDepartTree().then(res => {
        setDepartTree(res);
      });
    }
    if (record?.id) {
      setDisable(true)
    }
    formRef.current?.setFieldsValue(record);
  }, [record]);
  return (
    <ProForm
      formRef={formRef}
      title={title}
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
        name="departName"
        label="机构名称"
        rules={rules.departName}
        readonly={type === 'view'}
      />
      <ProFormSelect
        name="parentId"
        label="上级部门"
        rules={rules.parentId}
        options={departTree}
        readonly={type === 'view' || disable}
      />
      <ProFormText
        name="orgCode"
        label="机构编码"
        rules={rules.orgCode}
        readonly={type === 'view' || disable}
      />
      <ProFormDigit
        name="departOrder"
        label="排序"
        rules={rules.departOrder}
        readonly={type === 'view'}
      />
      <ProFormText
        name="mobile"
        label="手机号"
        rules={rules.mobile}
        readonly={type === 'view'}
      />
      <ProFormText
        name="fix"
        label="传真号"
        rules={rules.fix}
        readonly={type === 'view'}
      />
      <ProFormText
        name="address"
        label="地址"
        rules={rules.address}
        readonly={type === 'view'}
      />
      <ProFormTextArea
        name="memo"
        label="备注"
        rules={rules.memo}
        readonly={type === 'view'}
      />
    </ProForm>
  );
};

export default Form;
