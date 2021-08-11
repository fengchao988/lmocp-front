import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import BsTree from '@ttyys/bs-marketization-web/BsTree';
import { Calendar } from 'antd';
import { BsDataSourceBind } from '@ttyys/bs-marketization-web';
import CurrentDayFinishDescription from './CurrentDayFinishDescription';
import CurrentMonthFinishCountDescription from './CurrentMonthFinishCountDescription';

const ClassDailyStatistics = () => {
  const [teamId, setTeamId] = useState(null);
  const [date, setDate] = useState({ month: null, day: null });
  const handleChange = (v) => {
    if (v.length) {
      setTeamId(v[0]);
    } else {
      setTeamId(null);
    }
  };
  const handleSelect = (moment) => {
    setDate({
      month: moment.month() + 1,
      day: moment.date(),
    });
  };
  return (
    <ProCard split="vertical">
      <ProCard colSpan={4}>
        <BsDataSourceBind
          bindPropPath="$.dataSource"
          bindStore="classDailyOrganizationStore"
        >
          <BsTree onSelect={handleChange} />
        </BsDataSourceBind>
      </ProCard>
      <ProCard colSpan={20}>
        <ProCard colSpan={16}>
          <Calendar fullscreen={false} onSelect={handleSelect} mode="month" />
        </ProCard>
        <ProCard colSpan={8} split="horizontal">
          <ProCard bordered>
            <BsDataSourceBind
              bindPropPath="$.dataSource"
              bindStore="currentMonthFinishCountDescriptionStore"
              bindParams={{ teamId, month: date.month }}
            >
              <CurrentMonthFinishCountDescription />
            </BsDataSourceBind>
          </ProCard>
          <ProCard bordered>
            <BsDataSourceBind
              bindPropPath="$.dataSource"
              bindStore="currentDayFinishDescriptionStore"
              bindParams={{ teamId, day: date.day }}
            >
              <CurrentDayFinishDescription />
            </BsDataSourceBind>
          </ProCard>
        </ProCard>
      </ProCard>
    </ProCard>
  );
};

export default ClassDailyStatistics;
