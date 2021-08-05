import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { FilterDropdown, FieldLabel, useMountMergeState } from '@ant-design/pro-utils';
import { ConfigProvider } from 'antd';

import './index.less';
import type { LightFilterFooterRender } from '../../interface';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export type LightWrapperProps = {
  label?: React.ReactNode;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  size?: SizeType;
  value?: any;
  onChange?: (value?: any) => void;
  onBlur?: (value?: any) => void;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  valuePropName?: string;
  customLightMode?: boolean;
  light?: boolean;
  labelFormatter?: (value: any) => string;
  bordered?: boolean;
  otherFieldProps?: any;
  allowClear?: boolean;
  footerRender?: LightFilterFooterRender;
};

const LightWrapper: React.ForwardRefRenderFunction<any, LightWrapperProps> = (props) => {
  const {
    label,
    size,
    disabled,
    onChange: propsOnChange,
    className,
    style,
    children,
    valuePropName,
    placeholder,
    labelFormatter,
    bordered,
    footerRender,
    allowClear,
    otherFieldProps,
    ...rest
  } = props;

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-field-light-wrapper');
  const [tempValue, setTempValue] = useState<string | undefined>(props[valuePropName!]);
  const [open, setOpen] = useMountMergeState<boolean>(false);

  const onChange = (...restParams: any[]) => {
    otherFieldProps?.onChange?.(...restParams);
    propsOnChange?.(...restParams);
  };

  const labelValue = props[valuePropName!];

  return (
    <FilterDropdown
      disabled={disabled}
      onVisibleChange={setOpen}
      visible={open}
      label={
        <FieldLabel
          ellipsis
          size={size}
          onClear={() => {
            onChange?.();
            setTempValue(undefined);
          }}
          bordered={bordered}
          style={style}
          className={className}
          label={label}
          placeholder={placeholder}
          value={labelValue}
          disabled={disabled}
          expanded={open}
          formatter={labelFormatter}
          allowClear={allowClear}
        />
      }
      footer={{
        onClear: () => setTempValue(undefined),
        onConfirm: () => {
          onChange?.(tempValue);
          setOpen(false);
        },
      }}
      footerRender={footerRender}
    >
      <div className={classNames(`${prefixCls}-container`, className)} style={style}>
        {React.cloneElement(children as JSX.Element, {
          ...rest,
          [valuePropName!]: tempValue,
          onChange: (e: any) => {
            setTempValue(e?.target ? e.target.value : e);
          },
          ...(children as JSX.Element).props,
        })}
      </div>
    </FilterDropdown>
  );
};

export default LightWrapper;
