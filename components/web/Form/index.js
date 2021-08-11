import React, {useContext, useEffect} from "react";
import PropTypes from "prop-types";
import { ObjectSchema } from "yup";
import { Controller, useFormState } from "react-hook-form";
import { Form as AntdForm } from "antd";

const FormContext = React.createContext(null);

const Form = ({ control, children, rules, ...restProps }) => {
  return (
    <AntdForm {...restProps}>
      <FormContext.Provider value={{ control, rules }}>
        {React.Children.map(children, (child) => React.cloneElement(child))}
      </FormContext.Provider>
    </AntdForm>
  );
};

const FormItem = ({
  name,
  label,
  defaultValue,
  rules,
  children,
  ...restProps
}) => {
  const { control, ...restContext } = useContext(FormContext);
  const { errors } = useFormState({ control, name });
  let required = false;
  if (restContext.rules && restContext.rules instanceof ObjectSchema) {
    required = restContext.rules.fields[name].exclusiveTests.required;
  }
  return (
    <AntdForm.Item
      label={label}
      required={required}
      validateStatus={errors[name] &&'error'}
      help={errors[name]?.message}
      {...restProps}
    >
      <Controller
        rules={rules}
        defaultValue={defaultValue}
        control={control}
        render={({ field, formState }) => {
          return React.cloneElement(children, {
            onBlur: field.onBlur,
            onChange: field.onChange,
            value: field.value,
            ref: field.ref,
          });
        }}
        name={name}
      />
    </AntdForm.Item>
  );
};

FormItem.defaultProps = {
  name: PropTypes.string.isRequired,
};

Form.Item = ({ name, children, ...restProps }) => {
  return name ? (
    <FormItem {...restProps} name={name}>
      {children}
    </FormItem>
  ) : (
    <AntdForm.Item {...restProps}>{children}</AntdForm.Item>
  );
};

export default Form;
