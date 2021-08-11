import React, { useEffect, useState, createContext } from "react";
import { Table, Form } from "antd";
import PropTypes from 'prop-types';
import styled from "styled-components";

const EditableCell = ({
  disableEditing,
  dataIndex,
  inputRender,
  children,
  record,
}) => {
  let _inputRender = null;
  if (inputRender && typeof inputRender === "function") {
    _inputRender = inputRender({
      value: record[dataIndex],
      record,
      disableEditing,
      dataIndex,
    });
    return <td>{_inputRender}</td>;
  }

  return <td>{children}</td>;
};

const StyledTable = styled(Table)`
  .editable-row .ant-form-item-explain {
    position: absolute;
    top: 100%;
    font-size: 12px;
  }
`;

export const EditableContext = createContext(null);

const EnhanceTable = ({ onOk, dataSource, columns, ...restProps }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataSource);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = (record) => {
    form.validateFields().then((values) => {
      if (onOk) {
        onOk({ ...record, ...values }, cancel);
      }
    });
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        disableEditing: !isEditing(record),
        inputRender: col.inputRender,
        textRender: col.textRender,
      }),
    };
  });

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider
        value={{
          isEditing,
          cancel,
          save,
          edit,
          editingKey,
          form,
        }}
      >
        <StyledTable
          {...restProps}
          dataSource={data}
          columns={mergedColumns}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
        />
      </EditableContext.Provider>
    </Form>
  );
};

EnhanceTable.defaultProps = {
  /**
   * 行编辑保存方法
   */
  onOk: PropTypes.func,
}

export default EnhanceTable;
