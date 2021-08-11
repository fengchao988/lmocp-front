import React, { useState } from 'react';
import { Row, Col, Space } from 'antd';
import { ProFormSelect, ProFormDateRangePicker } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';

import { StatisticPrice } from '@ttyys/bs-marketization-web';
import CurrentClassProdCostList from "./CurrentClassProdCostList";
import AllClassProdCostList from "./AllClassProdCostList";
import ProdProcessList from "./ProdProcessList";
import OtherWorkList from "./OtherWorkList";

const ClassDailyBase = () => {
  const [activeKey, setActiveKey] = useState('1');
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={8}>
          <ProFormSelect label="填报班组" />
        </Col>
        <Col span={8}>
          <ProFormSelect label="工作地点" />
        </Col>
        <Col span={8}>
          <ProFormDateRangePicker label="业务区间"/>
        </Col>
        <Col span={8}>
          <ProFormSelect label="班次" />
        </Col>
        <Col span={8}>
          <ProFormSelect label="跟班班长" />
        </Col>
        <Col span={8}>
          <ProFormSelect label="分配方式" />
        </Col>
      </Row>
      <ProCard tabs={{ activeKey, onChange: setActiveKey }}>
        <ProCard.TabPane
          key="1"
          tab={
            <StatisticPrice
              title="产品市场人工费"
              price={200000}
              active={activeKey === '1'}
            />
          }
        >
          <Row>
            <Col span={14}>
              <CurrentClassProdCostList/>
            </Col>
            <Col span={10}>
              <AllClassProdCostList/>
            </Col>
          </Row>
        </ProCard.TabPane>
        <ProCard.TabPane
          key="2"
          tab={
            <StatisticPrice
              title="生产工序"
              price={1000}
              active={activeKey === '2'}
            />
          }
        >
          <ProdProcessList/>
        </ProCard.TabPane>
        <ProCard.TabPane
          key="3"
          tab={
            <StatisticPrice
              title="零星工作"
              price={20000}
              active={activeKey === '3'}
            />
          }
        >
          <OtherWorkList/>
        </ProCard.TabPane>
      </ProCard>
    </>
  );
};

export default ClassDailyBase;
