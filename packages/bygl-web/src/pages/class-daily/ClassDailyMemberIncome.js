import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { StatisticPrice } from '@ttyys/bs-marketization-web';
import MemberInfoDescription from './MemberInfoDescription';
import MemberIncomeList from './MemberIncomeList';

const ClassDailyMemberIncome = () => {
  const [activeKey, setActiveKey] = useState('1');
  return (
    <>
      <MemberInfoDescription />
      <ProCard tabs={{ activeKey, onChange: setActiveKey, tabPosition: 'top' }}>
        <ProCard.TabPane
          key="1"
          tab={
            <StatisticPrice
              title="员工收入"
              price={2000}
              active={activeKey === '1'}
            />
          }
        >
          <MemberIncomeList />
        </ProCard.TabPane>
        <ProCard.TabPane
          key="2"
          tab={
            <StatisticPrice
              title="产品市场"
              price={2000}
              active={activeKey === '2'}
            />
          }
        >
          <MemberIncomeList />
        </ProCard.TabPane>
        <ProCard.TabPane
          key="3"
          tab={
            <StatisticPrice
              title="单项工程市场"
              price={2000}
              active={activeKey === '3'}
            />
          }
        >
          <MemberIncomeList />
        </ProCard.TabPane>
        <ProCard.TabPane
          key="4"
          tab={
            <StatisticPrice
              title="班组考核"
              price={2000}
              active={activeKey === '4'}
            />
          }
        >
          <MemberIncomeList />
        </ProCard.TabPane>
        <ProCard.TabPane
          key="5"
          tab={
            <StatisticPrice
              title="包岗工资"
              price={2000}
              active={activeKey === '5'}
            />
          }
        >
          <MemberIncomeList />
        </ProCard.TabPane>
        <ProCard.TabPane
          key="6"
          tab={
            <StatisticPrice
              title="技能工资"
              price={2000}
              active={activeKey === '6'}
            />
          }
        >
          <MemberIncomeList />
        </ProCard.TabPane>
        <ProCard.TabPane
          key="7"
          tab={
            <StatisticPrice
              title="学习培训市场"
              price={2000}
              active={activeKey === '7'}
            />
          }
        >
          <MemberIncomeList />
        </ProCard.TabPane>
      </ProCard>
    </>
  );
};

export default ClassDailyMemberIncome;
