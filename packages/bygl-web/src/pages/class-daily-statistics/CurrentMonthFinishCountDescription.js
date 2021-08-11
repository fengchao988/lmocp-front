import React from 'react';
import { Descriptions, Empty } from 'antd';
import styled from 'styled-components';

const CurrentMonthFinishCountDescription = ({ dataSource = [] }) => {
  return (
    <StyledDescription title="本月完成情况数量" column={1} bordered>
      {dataSource.length ? (
        dataSource.map((m, i) => (
          <Descriptions.Item key={i} label={m.name}>
            {m.count}
          </Descriptions.Item>
        ))
      ) : (
        <Descriptions.Item>
          <Empty />
        </Descriptions.Item>
      )}
    </StyledDescription>
  );
};

const StyledDescription = styled(Descriptions)`
  &.ant-descriptions-bordered .ant-descriptions-item-label {
    width: 200px;
  }
`;

export default CurrentMonthFinishCountDescription;
