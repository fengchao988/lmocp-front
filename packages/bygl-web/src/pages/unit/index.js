import React, {useState} from 'react';
import ProCard from "@ant-design/pro-card";
import UnitTypeList from "./UnitTypeList";
import UnitList from "./UnitList";

const Unit = () => {
  const [record, setRecord] = useState({});
  return (
    <ProCard split="vertical">
      <ProCard colSpan="30%">
        <UnitTypeList onRowClick={(r) => setRecord(r)}/>
      </ProCard>
      <ProCard title={record.id? `当前分类:${record.name}`: '请选择分类'} headerBordered>
        <UnitList typeId={record.id}/>
      </ProCard>
    </ProCard>
  );
};
export default Unit;
