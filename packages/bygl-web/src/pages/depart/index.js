import React, {useEffect, useReducer, useRef, useState,} from 'react';
import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Col, Empty, Row, Space, Tabs, Tree,} from 'antd';
import {request} from 'umi';
import ObjectForm from './Form';
import ObjectModal from './Modal';


const deleteRequest = (id) =>
  request('/sys/user/delete', {
    method: 'delete',
    params: {
      id,
    },
  });

const OperationContext = React.createContext(null);


const initialState = {
  visible: false,
  record: null,
  type: 'add',
  title: '添加',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        type: 'add',
        title: '添加',
        ...action.payload,
      };
    case 'edit':
      return {
        ...state,
        type: 'edit',
        title: '编辑',
        ...action.payload,
      };
    case 'view':
      return {
        ...state,
        type: 'view',
        title: '详情',
        ...action.payload,
      };
  }
};

const queryDepartTree = () => {
  return new Promise((resolve) => {
    request('/sys/sysDepart/queryTreeList', {
      method: 'get',
    }).then((res) => {
      if (res && res.success) {
        resolve(res.result);
      } else {
        resolve([]);
      }
    });
  });
};

const ObjectTree = () => {
  const actionRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [treeData, setTreeData] = useState([]);
  const [editObj, setEditObj] = useState(initialState);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const handleToggleVisible = (v) => () => {
    dispatch({
      type: 'add',
      payload: {
        record: null,
        visible: v,
      },
    });
  };

  const handleClose = () => {
    dispatch({
      type: 'add',
      payload: {
        record: null,
        visible: false,
      },
    });
    actionRef.current?.reload();
  };

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    setEditObj({
      visible: true,
      record: info.node,
      type: 'edit',
      title: null
    });
  };
  useEffect(() => {
    queryDepartTree().then((res) => {
      setTreeData(res);
      const expandedKeys = [];
      for (let i = 0, len = res.length; i < len; i++) {
        if (res[i] && res[i].children && res[i].children.length > 0) {
          expandedKeys.push(res[i].key);
          setExpandedKeys(expandedKeys);
          break;
        }
      }
    });
  }, [treeData.length]);
  const {TabPane} = Tabs;
  return (
    <OperationContext.Provider value={{dispatch, state}}>
      <Row>
        <Col span={12}>
          <Tree
            showLine
            switcherIcon={<DownOutlined/>}
            defaultExpandedKeys={expandedKeys}
            onSelect={onSelect}
            treeData={treeData}
            toolbar={{
              title: (
                <Space>
                  <Button
                    key="button"
                    icon={<PlusOutlined/>}
                    type="primary"
                    onClick={handleToggleVisible(true)}
                  >
                    新建
                  </Button>
                </Space>
              ),
            }}
          />
        </Col>
        <Col span={12}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              {editObj?.visible ?
                <ObjectForm {...editObj} onClose={handleClose}/> :
                <Empty>
                  <span slot="description"> 请先选择一个部门! </span>
                </Empty>
              }
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <ObjectModal {...state} onClose={handleClose}/>
    </OperationContext.Provider>
  );
};

export default ObjectTree;
