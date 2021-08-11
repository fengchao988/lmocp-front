import styles from './index.less';
// @ts-ignore
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Input, InputNumber } from 'antd';
import { Form } from '@ttyys/components-web';
import { useMst } from 'umi';

const schema = yup.object().shape({
  name: yup.string().required('必填'),
  age: yup
    .number('数字类型')
    .positive()
    .integer('数字类型2')
    .required('必填')
    .typeError('必填')
    .nullable(),
});

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

export default function IndexPage() {
  const mst = useMst((state) => state.pagesStore);
  const { control, handleSubmit } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = (data) => console.log('data', data);
  return (
    <div>
      <Form {...formItemLayout} control={control} rules={schema}>
        <Form.Item label="名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="年龄" name="age" required>
          <InputNumber />
        </Form.Item>
        <Form.Item {...formTailLayout}>
          <Button type="primary" onClick={handleSubmit(onSubmit)}>
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
