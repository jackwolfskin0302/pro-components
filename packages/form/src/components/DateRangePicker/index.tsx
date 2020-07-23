import React from 'react';
// eslint-disable-next-line import/no-unresolved
import ProField from '@ant-design/pro-field';
import { Form } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { DatePickerProps } from 'antd/lib/date-picker';
import { createField } from '../../BaseForm';

/**
 * 日期区间选择组件
 * @param
 */
const ProFormDatePicker: React.FC<FormItemProps & DatePickerProps> = ({
  value,
  ...restProps
}) => {
  return (
    <Form.Item {...restProps}>
      <ProField
        text={value}
        {...restProps}
        mode="edit"
        formItemProps={restProps}
        valueType="dateTimeRange"
      />
    </Form.Item>
  );
};

export default createField<FormItemProps & DatePickerProps>(ProFormDatePicker);
