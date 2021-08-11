import React, { useState } from "react";
import { Table } from "@ttyys/components-web";
import { request } from "umi";
import { Button, Popconfirm, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const delUmit = (id) =>
  request(`/lean/leanMaterial/delete`, {
    method: "delete",
    params: {
      id,
    },
  });

const getUmitType = (params) =>
  request("/connect/measure_unit/list", {
    params: {
      ...params,
      pageNo: params.current,
    },
  });

const columns = [
  {
    title: "单位名称",
    dataIndex: "name",
  },
  {
    title: "符号",
    dataIndex: "symbol",
  },
  {
    title: "操作",
    valueType: "option",
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <Popconfirm
        title="确定要删除吗？"
        onConfirm={async () => {
          try {
            const res = await delUmit(record.id);
            if (res.success) {
              message.success("删除成功");
              action?.reload();
            } else {
              message.error(res.message);
            }
          } catch (e) {
            console.log("e", e);
            message.error("删除失败");
          }
        }}
      >
        <a>删除</a>
      </Popconfirm>,
    ],
  },
];

const UnitList = () => {
  const [editableKeys, setEditableRowKeys] = useState([]);
  const handleSave = async (rowKey, data, row) => {};

  return (
    <div>
      <Space>
        <Button icon={<PlusOutlined />} type="primary">
          分类
        </Button>
      </Space>
      <Table
        rowkey="id"
        columns={columns}
        recordCreatorProps={{
          position: "top",
          record: () => ({
            id: (Math.random() * 1000000).toFixed(0),
            isCreate: true,
          }),
        }}
        request={async (params) => {
          const res = await getUmitType(params);
          return Promise.resolve({
            data: res.result.records,
            total: res.result.total,
            success: true,
          });
        }}
        editable={{
          type: "multiple",
          editableKeys,
          onSave: handleSave,
          onChange: setEditableRowKeys,
        }}
      />
    </div>
  );
};

export default UnitList;
