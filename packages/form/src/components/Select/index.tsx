import React from 'react';
import type { SelectProps } from 'antd';
import ProFormField from '../Field';
import type { ProSchema } from '@ant-design/pro-utils';
import { runFunction } from '@ant-design/pro-utils';
import type { ProFormFieldItemProps } from '../../interface';
import type { ExtendsProps } from '../../BaseForm/createField';

export type ProFormSelectProps<T = any> = ProFormFieldItemProps<
  SelectProps<T> & {
    /**
     * 是否在输入框聚焦时触发搜索
     *
     * @default false
     */
    searchOnFocus?: boolean;
    /**
     * 选择完一个之后是否清空搜索项重新搜索
     *
     * @default false
     */
    resetAfterSelect?: boolean;
    /** 自定义选项渲染 */
    optionItemRender?: (item: T) => React.ReactNode;
  }
> & {
  valueEnum?: ProSchema['valueEnum'];
  params?: ProSchema['params'];
  request?: ProSchema['request'];
  options?: SelectProps<any>['options'] | string[];
  mode?: SelectProps<any>['mode'] | 'single';
  showSearch?: SelectProps<any>['showSearch'];
  readonly?: boolean;
};

/**
 * 选择框
 *
 * @param
 */
const ProFormSelectComponents = React.forwardRef<any, ProFormSelectProps<any>>(
  (
    {
      fieldProps,
      children,
      params,
      proFieldProps,
      mode,
      valueEnum,
      request,
      showSearch,
      options,
      ...rest
    },
    ref,
  ) => {
    return (
      <ProFormField<any>
        mode="edit"
        valueEnum={runFunction(valueEnum)}
        request={request}
        params={params}
        valueType="select"
        filedConfig={{ customLightMode: true }}
        fieldProps={
          {
            options,
            mode,
            showSearch,
            ...fieldProps,
          } as SelectProps<any>
        }
        ref={ref}
        proFieldProps={proFieldProps}
        {...rest}
      >
        {children}
      </ProFormField>
    );
  },
);

const SearchSelect = React.forwardRef<any, ProFormSelectProps<any>>(
  (
    { fieldProps, children, params, proFieldProps, mode, valueEnum, request, options, ...rest },
    ref,
  ) => {
    const props: Omit<SelectProps<any>, 'options'> & {
      options?: ProFormSelectProps['options'];
    } = {
      options,
      mode: (mode as 'multiple') || 'multiple',
      labelInValue: true,
      showSearch: true,
      showArrow: false,
      autoClearSearchValue: true,
      optionLabelProp: 'label',
      filterOption: false,
      ...fieldProps,
    };
    return (
      <ProFormField<any>
        mode="edit"
        valueEnum={runFunction(valueEnum)}
        request={request}
        params={params}
        valueType="select"
        filedConfig={{ customLightMode: true }}
        fieldProps={props}
        ref={ref}
        proFieldProps={proFieldProps}
        {...rest}
      >
        {children}
      </ProFormField>
    );
  },
);

const ProFormSelect = ProFormSelectComponents as <T>(
  props: ProFormSelectProps<T> & ExtendsProps,
) => React.ReactElement;

const ProFormSearchSelect = SearchSelect as <T>(
  props: ProFormSelectProps<T> & ExtendsProps,
) => React.ReactElement;

const WrappedProFormSelect = ProFormSelect as (<T = any>(
  props: ProFormSelectProps<T>,
) => React.ReactElement) & {
  SearchSelect: typeof ProFormSearchSelect;
};

WrappedProFormSelect.SearchSelect = ProFormSearchSelect;

export default WrappedProFormSelect;
