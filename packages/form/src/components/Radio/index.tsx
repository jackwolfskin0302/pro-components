import React from 'react';
import { Radio } from 'antd';
import ProField from '@ant-design/pro-field';
import { ProSchema } from '@ant-design/pro-utils';
import { RadioGroupProps, RadioProps } from 'antd/lib/radio';
import createField from '../../BaseForm/createField';
import { ProFormItemProps } from '../../interface';

export type ProFormRadioGroupProps = ProFormItemProps<RadioGroupProps> & {
  layout?: 'horizontal' | 'vertical';
  radioType?: 'button' | 'radio';
  options?: RadioGroupProps['options'];
  valueEnum?: ProSchema['valueEnum'];
  request?: ProSchema['request'];
};

const RadioGroup: React.FC<ProFormRadioGroupProps> = React.forwardRef(
  ({ fieldProps, options, radioType, proFieldProps }, ref: any) => {
    return (
      <ProField
        mode="edit"
        valueType={radioType === 'button' ? 'radioButton' : 'radio'}
        ref={ref}
        fieldProps={{
          options,
          ...fieldProps,
        }}
        {...proFieldProps}
      />
    );
  },
);

/**
 * Radio
 * @param
 */
const ProFormRadio: React.FC<ProFormItemProps<RadioProps>> = React.forwardRef(
  ({ fieldProps, children }, ref: any) => {
    return (
      <Radio {...fieldProps} ref={ref}>
        {children}
      </Radio>
    );
  },
);

const Group = createField(RadioGroup, {
  customLightMode: true,
});

// @ts-expect-error
const WrappedProFormRadio: React.ComponentType<ProFormItemProps<RadioProps>> & {
  Group: typeof Group;
  Button: typeof Radio.Button;
} = createField<ProFormItemProps<RadioProps>>(ProFormRadio, {
  valuePropName: 'checked',
});
WrappedProFormRadio.Group = Group;

WrappedProFormRadio.Button = Radio.Button;

export default WrappedProFormRadio;
