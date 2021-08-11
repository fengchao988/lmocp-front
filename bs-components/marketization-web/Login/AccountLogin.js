import React, { useRef } from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Input, Space, Row, Col, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { Form } from "@ttyys/components-web";

const schema = yup.object().shape({
  username: yup.string().max(20, "用户名过长").required("请输入用户名"),
  password: yup.string().max(20, "密码过长").required("请输入登录密码"),
});

const AccountLogin = ({ loading, login }) => {
  const loginRef = useRef();
  const enterKey = useRef();
  loginRef.current = login;

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const submit = (data, e) => {
    loginRef.current(data);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Form control={control} rules={schema}>
        <Form.Item name="username">
          <Input
            placeholder="请输入用户名"
            addonBefore={<UserOutlined />}
            size="large"
          />
        </Form.Item>
        <Form.Item name="password">
          <Input
            type="password"
            placeholder="请输入密码"
            addonBefore={<LockOutlined />}
            size="large"
          />
        </Form.Item>
      </Form>
      <Col span={24}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row justify="space-between">
            <Checkbox>自动登陆</Checkbox>
          </Row>
          <Button
            ref={enterKey}
            loading={loading}
            type="primary"
            style={{ width: "100%" }}
            size="large"
            onClick={handleSubmit(submit)}
          >
            确定
          </Button>
        </Space>
      </Col>
    </Space>
  );
};

AccountLogin.propTypes = {
  loading: PropTypes.bool,
  login: PropTypes.func,
};

AccountLogin.defaultProps = {
  loading: false,
  login: () => void 0,
};

export default AccountLogin;
