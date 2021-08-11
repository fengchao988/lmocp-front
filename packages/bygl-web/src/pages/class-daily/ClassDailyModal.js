import React, { useRef, useState } from 'react';
import { Modal } from 'antd';
import { StepsForm } from '@ant-design/pro-form';

import ClassDailyBase from './ClassDailyBase';
import ClassDailyMemberIncome from "./ClassDailyMemberIncome";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const ClassDailyModal = ({ record, type, refresh = () => undefined }) => {
  const [visible, setVisible] = useState(true);
  return (
    <StepsForm
      formProps={{
        layout: 'horizontal',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            title="分步表单"
            width={1200}
            onCancel={() => setVisible(false)}
            visible={visible}
            footer={submitter}
            destroyOnClose
          >
            {dom}
          </Modal>
        );
      }}
    >
      <StepsForm.StepForm name="base" title="基本信息">
        <ClassDailyBase />
      </StepsForm.StepForm>
      <StepsForm.StepForm name="second" title="基本信息2">
        <ClassDailyMemberIncome/>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="third" title="基本信息3"></StepsForm.StepForm>
    </StepsForm>
  );
};

export default ClassDailyModal;
