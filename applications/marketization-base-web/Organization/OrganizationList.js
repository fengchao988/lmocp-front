import React, { useContext, useRef, useState } from "react";
import ProTable from "@ant-design/pro-table";
import { request } from "umi";
import {Button, message, Popconfirm, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import SyncOrganizationType from "./SyncOrganizationType";

const columns = [
    {
        title: "流程名称",
        dataIndex: "name",
    },
    {
        title: "流程节点",
        dataIndex: "node",
    },
    {
        title: "创建时间",
        dataIndex: "createTime",
    },
    {
        title: "操作",
        valueType: "option",
        render: (text, record, _, action) => [
            <OperationEdit record={record} />,
            <OperationDel record={record} />,
        ],
    },
];

export const TableContext = React.createContext(null);

const OperationEdit = ({ record }) => {
    const { onEdit } = useContext(TableContext);
    return <a onClick={onEdit(record)}>编辑</a>;
};

const OperationDel = ({ record }) => {
    const { onDel } = useContext(TableContext);
    return (
        <Popconfirm title="确定要删除吗？" onConfirm={onDel(record.id)}>
            <a>删除</a>
        </Popconfirm>
    );
};

/**
 * 审核流程管理列表
 * @constructor
 */
const BaseAuditProgressList = ({ fetchUrl, delUrl }) => {
    const actionRef = useRef();
    const [record, setRecord] = useState({});
    const [type, setType] = useState({ type: null, op: false });
    const handleAdd = () => {
        setType(prev=> ({
            type: 'add',
            op: !prev.op,
        }));
    };
    const handleDel = (id) => () => {
        try {
            const res = request(delUrl, {
                method: "delete",
                params: {
                    id,
                },
            });
            if (res.success) {
                message.success(res.message);
            } else {
                message.error(res.message);
            }
        } catch (e) {
            console.log("e", e);
            message.error("删除失败");
        }
    };
    const handleReload = () => {
        actionRef.current?.reload();
    }
    const handleEdit = (record) => () => {
        setRecord(record);
        setType(prev=> ({
            type: 'edit',
            op: !prev.op,
        }));
    };
    return (
      <TableContext.Provider
        value={{ onDel: handleDel, onEdit: handleEdit, record, reload: handleReload, type }}
      >
        <ProTable
          columns={columns}
          actionRef={actionRef}
          rowKey="id"
          search={false}
          pagination={{ pageSize: 10 }}
          request={async (params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            console.log(params, sorter, filter);
            try {
              const res = await request(fetchUrl, {
                params: {
                  ...params,
                  pageNo: params.current,
                },
              });
              return Promise.resolve({
                data: res.result.records,
                total: res.result.total,
                success: true,
              });
            } catch (e) {
              console.log("e", e);
            }
          }}
          options={false}
          toolbar={{
            title: (
              <Space>
                <Button
                  key="button"
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={handleAdd}
                >
                  添加
                </Button>
                <SyncOrganizationType
                />
              </Space>
            ),
          }}
        />
      </TableContext.Provider>
    );
};

export default BaseAuditProgressList;
