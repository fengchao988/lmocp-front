import React, { useEffect, useState } from "react";
import { useMst } from "umi";
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import createField from "@ant-design/pro-form/lib/BaseForm/createField";
import { getFileAccessHttpUrl } from "./mange";

const uidGenerator = () => {
  return "-" + parseInt(Math.random() * 10000 + 1, 10);
};;

const ProFormUploadButton = (
    {
        fieldProps,
        name,
        action,
        accept,
        listType,
        title = '单击上传',
        max,
        icon = <UploadOutlined />,
        value,
        buttonProps,
        onChange,
        disabled,
        proFieldProps,
    },
    ref,
) => {
    // 如果配置了 max ，并且 超过了文件列表的大小，就不展示按钮
    const showUploadButton =
        (max === undefined || !value || value?.split(',')?.length < max) && proFieldProps?.mode !== 'read';

    const isPictureCard = (listType ?? fieldProps?.listType) === 'picture-card';
    const mstStore = useMst((state) => state.mstStore);
    const [fileList, setFileList] = useState([]);

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            const fileList = info.fileList.map(item => ({
                ...item,
                status: item?.response?.success ? 'done' :'error',
                url: item?.response?.success ? getFileAccessHttpUrl(item?.response?.message): null,
                _url: item?.response?.success? item?.response?.message: null,
                response: item?.response.success? item?.response: '上传失败',
            }));
            setFileList(fileList);
            const path = fileList.filter(f => f.status === 'done').map(m => m._url).join(',');
            if (fieldProps.onChange) {
                fieldProps.onChange(path);
            }
        } else {
            setFileList(info.fileList);
        }
    };
    useEffect(() => {
        let _fileList = [];
        if (value instanceof Array) {
            _fileList = value;
        }
        if (!value) {
            _fileList = [];
        }
        if (typeof value === 'string') {
            _fileList = value.split(",");
        }
        setFileList(
            _fileList.map((m) => ({
                uid: uidGenerator(),
                name: m,
                status: "done",
                url: getFileAccessHttpUrl(m),
                response: {
                    status: "history",
                    success: true,
                    message: m,
                },
            }))
        );
    }, [value]);

    return (
        <Upload
            action="/lmocp-system/sys/common/upload"
            accept="image/*"
            ref={ref}
            name="file"
            listType={listType || 'picture'}
            fileList={fileList}
            headers={{
                "X-Access-Token": mstStore.token,
            }}
            {...fieldProps}
            onChange={handleChange}
        >
            {showUploadButton &&
            (isPictureCard ? (
                <span>
            {icon} {title}
          </span>
            ) : (
                <Button disabled={disabled || fieldProps?.disabled} {...buttonProps}>
                    {icon}
                    {title}
                </Button>
            ))}
        </Upload>
    );
};

export default createField(React.forwardRef(ProFormUploadButton));
