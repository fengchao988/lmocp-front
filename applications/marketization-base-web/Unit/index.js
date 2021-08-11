import React from 'react';
import ProCard from "@ant-design/pro-card";
import UnitTypeList from "./UnitTypeList";
import UnitList from "./UnitList";

const Unit = () => {
  return (
    <ProCard split="vertical">
      <ProCard title="左侧详情" colSpan="30%">
        <UnitTypeList />
      </ProCard>
      <ProCard title="左右分栏子卡片带标题" headerBordered>
        <UnitList />
      </ProCard>
    </ProCard>
  );
};
export default Unit;
