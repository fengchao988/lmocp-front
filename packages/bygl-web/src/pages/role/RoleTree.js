import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { request } from 'umi';

const queryTreeFormRole = (params) => request('/sys/role/queryTreeList', {
  method: 'get',
  params: params,
});

const queryRolePermission = params => request('/sys/permission/queryRolePermission', {
  method: 'get',
  params,
});

const transferData = data => data.map(m => ({
  ...m,
  title: m.slotTitle,
  children: m.children && m.children.length ? transferData(m.children) : undefined,
}))

const RoleTree = ({ roleId, value, onChange }) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeData, setTreeData] = useState([]);

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    onChange(checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue) => {
    setSelectedKeys(selectedKeysValue);
  };

  useEffect(() => {
    setCheckedKeys(value);
  }, [value]);

  useEffect(() => {
    if (roleId) {
      queryTreeFormRole().then(res => {
        setTreeData(transferData(res.result.treeList));
        queryRolePermission({ roleId }).then(res2 => {
          setCheckedKeys(res2.result);
          setExpandedKeys(res.result.ids);
        })
      });
    }
  } ,[ roleId ]);

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
    />
  );
};

export default RoleTree;
