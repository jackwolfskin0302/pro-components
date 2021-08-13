import React from 'react';

import ProField from '@ant-design/pro-field';
import type { ProFormFieldItemProps } from '../../interface';
import createField from '../../BaseForm/createField';
import type { TextAreaProps } from 'antd/lib/input';
/**
 * 文本选择组件
 *
 * @param
 */
const ProFormTextArea: React.ForwardRefRenderFunction<any, ProFormFieldItemProps<TextAreaProps>> = (
  { fieldProps, proFieldProps, ...rest },
  ref,
) => {
  return (
    <ProField
      text={fieldProps?.value as string}
      ref={ref}
      mode="edit"
      valueType="textarea"
      fieldProps={{
        ...fieldProps,
        onChange: (...restParams: any) => {
          (fieldProps?.onChange as any)?.(...restParams);
          (rest as any)?.onChange?.(...restParams);
        },
      }}
      {...proFieldProps}
    />
  );
};

export default createField<ProFormFieldItemProps<TextAreaProps>>(React.forwardRef(ProFormTextArea));
