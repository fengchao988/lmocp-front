import React from 'react';
import {Descriptions, Empty} from 'antd';
import styled from "styled-components";

const CurrentDayFinishDescription = ({ dataSource = [] }) => {
  return (
    <StyledDescription title="当日完成情况" column={1} bordered>
      {dataSource.length? dataSource.map((m, i) => (
        <Descriptions.Item key={i} label={m.name}>
          {m.value}
        </Descriptions.Item>
      )): <Descriptions.Item>
        <Empty/>
      </Descriptions.Item>}
    </StyledDescription>
  );
};

const StyledDescription = styled(Descriptions)`
  &.ant-descriptions-bordered .ant-descriptions-item-label {
    width: 200px;
  }
`

export default CurrentDayFinishDescription;
