import React, {useContext, useState} from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { message, Popconfirm } from 'antd';
import styled from "styled-components";
import ProForm from "@ant-design/pro-form";

export const EditableTableContext = React.createContext(null);

const Option = {
    title: '操作',
    valueType: 'option',
    align: 'center',
    render: (text, record, _, action) => [
        <a
            key="editable"
            onClick={() => {
                action?.startEditable?.(record.id);
            }}
        >
            编辑
        </a>,
        <OptionDel record={record} />,
    ],
};

const OptionDel = ({ record }) => {
    const { dataSource, onChange, onDel } = useContext(EditableTableContext);
    return (
        <Popconfirm
            title="确定要删除吗？"
            onConfirm={async () => {
                if (onDel && !record.isCreate) {
                    const res = await onDel(record);
                    if (res.success) {
                        message.success(res.message);
                        const _dataSource = dataSource.filter((f) => f.id !== record.id);
                        onChange(_dataSource);
                    } else {
                        message.error(res.message);
                    }
                } else {
                    const _dataSource = dataSource.filter((f) => f.id !== record.id);
                    onChange(_dataSource);
                }
            }}
        >
            <a>删除</a>
        </Popconfirm>
    );
};

const ProFormEditableProTable = ({
                                     columns = [],
                                     value = [],
                                     onChange = () => undefined,
                                     onDel =() => undefined,
                                     headerTitle,
                                     ...restProps
                                 }) => {
    const [editableKeys, setEditableRowKeys] = useState([]);
    ;
    const handleSave = async (rowKey, data, row) => {
        if (value.some(v => v.id === data.id)) {
            onChange(value.map(m => m.id === data.id ? data : m));
        } else {
            // 为了消除新增时候key的bug显示，实际editable内部还是有bug
            onChange([...value, { ...data, id: (Math.random() * 1000000).toFixed(0)}]);
        }
    };
    return (
        <StyledProFOrmItem {...restProps}>
            <EditableTableContext.Provider value={{ dataSource: value, onChange, onDel }}>
                <EditableProTable
                    headerTitle={headerTitle}
                    rowKey="id"
                    recordCreatorProps={{
                        record: () => ({ id: (Math.random() * 1000000).toFixed(0), isCreate: true }),
                    }}
                    value={value}
                    onChange={() => {}}
                    columns={[...columns, Option]}
                    controlled={false}
                    editable={{
                        onSave: handleSave,
                        editableKeys,
                        onChange: setEditableRowKeys,
                        actionRender: (row, config, defaultDom) => [
                            defaultDom.save,
                            defaultDom.cancel,
                        ],
                    }}
                />
            </EditableTableContext.Provider>
        </StyledProFOrmItem>
    );
};

const StyledProFOrmItem = styled(ProForm.Item)`
  &
    > .ant-col.ant-form-item-control
    > .ant-form-item-explain.ant-form-item-explain-error {
    margin: 0 24px;
  }
`;

export default ProFormEditableProTable;
