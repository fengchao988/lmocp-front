import React, {useContext, useState} from "react";
import {Button, message, Select} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { request } from 'umi';

import { TableContext } from './OrganizationList';

const typeList = [
  { value: "product", text: "生产区队" },
  { value: "function", text: "职能部门" },
  { value: "team", text: "班组" },
  { value: "productUser", text: "生产区队用户" },
  { value: "functionUser", text: "职能部门用户" },
  { value: "teamUser", text: "班组用户" },
];

export const OrganizationType = ({ onChange, value }) => {
  return (
    <Select placeholder="请选择" onChange={onChange} value={value}>
      {typeList.map((m) => (
        <Select.Option value={m.value} key={m.value}>
          {m.text}
        </Select.Option>
      ))}
    </Select>
  );
};

const postSync = type => request('/leanOrganization/syncDeptOrUserByType', {
    method: 'post',
    data: {
        type,
    },
});

const SyncOrganizationType = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(undefined);
  const { reload } = useContext(TableContext);
  const handleOrganizationTypeChange = (v) => {
      setValue(v);
  }
  const handleSync  = async () => {
      setLoading(true);
      try {
          const res = await postSync(value);
          if (res.success) {
              message.success(res.message);
              reload();
          }else {
              message.error(res.message);
          }
      }catch (e) {
          message.error('同步失败');
      }
      setLoading(false);
  }
  return (
    <>
      <OrganizationType onChange={handleOrganizationTypeChange} value={value}/>
      <Button icon={<SyncOutlined />} disabled={loading} type="primary" onClick={handleSync}>
        同步
      </Button>
    </>
  );
};

export default SyncOrganizationType;
