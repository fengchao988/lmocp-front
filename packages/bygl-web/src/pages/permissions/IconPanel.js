import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactIs from 'react-is';
import * as Icons from '@ant-design/icons';
import * as R from 'ramda';
import { Button, Input, Space, Tabs } from 'antd';
import styled from 'styled-components';
import { Modal } from 'antd';

const _Icons = Object.keys(Icons).filter((m) => {
  if (m === 'default') return false;
  if (typeof Icons[m] === 'function') return false;
  return ReactIs.isValidElementType(Icons[m]);
});

const groupIcons = R.groupBy((icon) => {
  if (icon.endsWith('TwoTone')) {
    return 'TwoTone';
  } else if (icon.endsWith('Filled')) {
    return 'Filled';
  } else if (icon.endsWith('Outlined')) {
    return 'Outlined';
  }
  return 'Other';
}, _Icons);

console.log('grouIcons', groupIcons);

const iconTypes = {
  Filled: '填充图标',
  Outlined: '非填充图标',
  TwoTone: '多色图标',
  Other: '其他图标',
};

const StyledDiv = styled.div`
  display: inline-block;
  background: ${(props) => (props.active ? '#66ccee' : '#FFFFFF')};
  cursor: pointer;
  :hover {
    background: #66ccee;
    opacity: 0.5;
  }
`;

const IconList = ({ icons, onClick, active }) =>
  icons.map((m) => {
    const Icon = Icons[m];
    return (
      <StyledDiv active={active === m} onClick={onClick(m)} key={m}>
        <Icon value={m} style={{ fontSize: 20, padding: 20 }} />
      </StyledDiv>
    );
  });

const IconPanel = ({ value, onChange, readOnly }) => {
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const okRef = useRef();
  okRef.current = onChange;
  const memoIcons = useMemo(
    () => Object.keys(groupIcons).filter((f) => f !== 'Other'),
    [],
  );

  const Icon = useMemo(() => {
    return () => {
      if (value && Icons[value]) {
        const IconComp = Icons[value];
        return <IconComp style={{ fontSize: 20, padding: '0 20px' }} />;
      }
      if (readOnly) {
        return <div />;
      }
      return <Input placeholder="请选择图标" readOnly={true} />;
    };
  }, [value, readOnly]);

  const onCLick = useCallback(
    (active) => () => {
      setActive(active);
    },
    [],
  );

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    if (okRef.current) {
      okRef.current(active);
    }
    setVisible(false);
  };

  useEffect(() => {
    setActive(value);
  }, [value]);
  return (
    <>
      <Modal
        title="编辑图标"
        width={770}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Tabs>
          {memoIcons.map((m) => (
            <Tabs.TabPane key={m} tab={iconTypes[m]}>
              <IconList
                icons={groupIcons[m]}
                onClick={onCLick}
                active={active}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Modal>
      <Space>
        <Icon />
        {!readOnly && (
          <Button
            icon={<Icons.CheckOutlined />}
            type="primary"
            onClick={() => setVisible(true)}
          >
            请选择图标
          </Button>
        )}
      </Space>
    </>
  );
};

export default IconPanel;
