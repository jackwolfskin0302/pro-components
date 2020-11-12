import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { FilterDropdown, FieldLabel, isDropdownValueType } from '@ant-design/pro-utils';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ConfigProvider } from 'antd';

import './index.less';

export interface LightWrapperProps {
  label?: React.ReactNode;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  size?: SizeType;
  value?: any;
  onChange?: (value?: any) => void;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  valuePropName: string;
  customLightMode?: boolean;
  light?: boolean;
  id?: string;
  labelFormatter?: (value: any) => string;
  bordered?: boolean;
}

const LightWrapper: React.ForwardRefRenderFunction<any, LightWrapperProps> = (props, ref) => {
  const {
    label,
    size,
    disabled,
    onChange,
    className,
    style,
    children,
    valuePropName,
    light,
    customLightMode,
    placeholder,
    id,
    labelFormatter,
    bordered,
    value,
  } = props;

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-field-light-wrapper');
  const [tempValue, setTempValue] = useState<string | undefined>(props[valuePropName]);
  const [open, setOpen] = useState<boolean>(false);

  const isDropdown =
    React.isValidElement(children) && isDropdownValueType(children.props.valueType);

  if (!light || customLightMode || isDropdown) {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        value,
        onChange,
        ...children.props,
        fieldProps: {
          id,
          [valuePropName]: props[valuePropName],
          // 这个 onChange 是 Form.Item 添加上的，要通过 fieldProps 透传给 ProField 调用
          onChange,
          // 优先使用 children.props.fieldProps，比如 LightFilter 中可能需要通过 fieldProps 覆盖 Form.Item 默认的 onChange
          ...children.props.fieldProps,
        },
      });
    }
    return children as JSX.Element;
  }

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
          value={props[valuePropName]}
          disabled={disabled}
          expanded={open}
          formatter={labelFormatter}
        />
      }
      footer={{
        onClear: () => setTempValue(undefined),
        onConfirm: () => {
          onChange?.(tempValue);
          setOpen(false);
        },
      }}
    >
      <div className={classNames(`${prefixCls}-container`, className)} style={style}>
        {React.isValidElement(children)
          ? React.cloneElement(children, {
              ref,
              ...children.props,
              fieldProps: {
                className: `${prefixCls}-field`,
                [valuePropName]: tempValue,
                id,
                onChange: (e: any) => {
                  setTempValue(e?.target ? e.target.value : e);
                },
                ...children.props.fieldProps,
              },
            })
          : children}
      </div>
    </FilterDropdown>
  );
};

export default React.forwardRef(LightWrapper);
