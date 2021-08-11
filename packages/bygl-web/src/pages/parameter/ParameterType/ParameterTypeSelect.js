import React from 'react';
import { Select } from 'antd';
import { ProFormSelect } from '@ant-design/pro-form';
import { inject, observer } from 'umi';

const ParameterTypeSelect = ({ parameterTypeStore: { dataSource }, ...restProps }) =>  <ProFormSelect options={dataSource} {...restProps}/>

export default inject('parameterTypeStore')(observer(ParameterTypeSelect));
