import React, {useState} from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { request } from 'umi';
import {Popconfirm} from "antd";

const delUmit = id => request(`/connect/quota-unit-category/${id}`, {
    method: 'delete',
});

const getUmitType = params => request('/connect/unit_category/page', {
    params: {
        ...params,
        pageNo: params.current,
    }
});

const columns = [{
    title: '分类名称',
    dataIndex: 'name',
}, {
    title: '操作',
    valueType: 'option',
    render: (text, record, _, action) => [
        <a
            key="editable"
            onClick={() => {
                action?.startEditable?.(record.id);
            }}
        >
            编辑
        </a>,
        <Popconfirm title="确定要删除吗？" onConfirm={async () => {
            try {
                const res = await delUmit(record.id);
                if (res.success) {
                    message.success('删除成功');
                    action?.reload();
                } else {
                    message.error(res.message);
                }
            } catch (e) {
                console.log('e', e)
                message.error('删除失败')
            }
        }}>
            <a>删除</a>
        </Popconfirm>
    ],
}];

const UnitTypeList = () => {
    const [editableKeys, setEditableRowKeys] = useState([]);
    const handleSave = async (rowKey,data,row) => {

    };

    return <EditableProTable
            rowkey="id"
            columns={columns}
            recordCreatorProps={{
                position: 'top',
                record: ()=> ({ id:  (Math.random() * 1000000).toFixed(0), isCreate: true })
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
                type: 'multiple',
                editableKeys,
                onSave: handleSave,
                onChange: setEditableRowKeys,
            }}
        />
}

export default UnitTypeList;