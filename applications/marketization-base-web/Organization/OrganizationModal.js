import { useContext, useEffect, useRef, useState } from "react";
import ProForm, { ModalForm, ProFormText } from "@ant-design/pro-form";
import { message, Select } from "antd";
import { request, inject, observer } from "umi";

import { TableContext } from "./OrganizationList";

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
  name: [{ required: true, message: "必填" }],
  type: [{ required: true, message: "必填" }],
};

const addOrganization = (data) =>
  request("/szyk/leanOrganization/add", {
    method: "post",
    data,
  });

const editOrganization = (data) =>
  request("/szyk/leanOrganization/edit", {
    method: "put",
    data,
  });

const RoleModal = ({ organizationTypeStore }) => {
  const { record, reload, type } = useContext(TableContext);
  const formRef = useRef();
  const [visible, setVisible] = useState(false);
  const onFinish = async (values) => {
    try {
      type.type === "edit"
        ? await editOrganization({ ...values, id: record.id })
        : await addOrganization(values);
      formRef.current?.resetFields();
      reload();
    } catch (e) {
      message.error(e.message);
    }
  };
  const handleCancel = () => {
    formRef.current?.resetFields();
  };

  useEffect(() => {
    if (["add", "view", "edit"].includes(type.type)) {
      formRef.current?.setFieldsValue(record);
      setVisible(true);
    }
  }, [type.type, type.op, record]);

  useEffect(() => {
    organizationTypeStore.fetchData();
  }, []);
  return (
    <ModalForm
      formRef={formRef}
      title={title}
      visible={visible}
      modalProps={{
        onCancel: handleCancel,
      }}
      layout="horizontal"
      rules={rules}
      {...formItemLayout}
      onFinish={onFinish}
      submitter={{
        submitButtonProps: {
          style: {
            display: type === "view" ? "none" : "block",
          },
        },
      }}
    >
      <ProFormText
        name="name"
        label="组织名称"
        rules={rules.name}
        readonly={type.type === "view"}
      />
      <ProForm.Item name="type" rules={rules.type}>
        <Select
          options={organizationTypeStore.dataSource}
          placeholder="请选择"
          readonly={type.type === "view"}
        />
      </ProForm.Item>
    </ModalForm>
  );
};

export default inject("organizationTypeStore")(observer(RoleModal));
