import React from 'react';
import ProField from '@ant-design/pro-field';
import type { DatePickerProps } from 'antd/lib/date-picker';
import type { ProFormItemProps } from '../../interface';
import createField from '../../BaseForm/createField';

const valueType = 'dateRange';

/**
 * 日期区间选择组件
 *
 * @param
 */
const ProFormDatePicker: React.FC<
  ProFormItemProps<DatePickerProps>
> = React.forwardRef(({ fieldProps, proFieldProps }, ref) => (
  <ProField
    ref={ref}
    text={fieldProps?.value}
    mode="edit"
    fieldProps={fieldProps}
    valueType={valueType}
    {...proFieldProps}
  />
));

export default createField<ProFormItemProps<DatePickerProps>>(ProFormDatePicker, {
  valueType,
  customLightMode: true,
});
