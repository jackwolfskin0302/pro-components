/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { useContainer } from '../container';
import type { ProFormFieldProps } from '@ant-design/pro-form';
import { ProFormField, ProFormDependency } from '@ant-design/pro-form';
import type { ProFieldEmptyText } from '@ant-design/pro-field';
import type { ProFieldValueType, ProSchemaComponentTypes } from '@ant-design/pro-utils';
import { isDeepEqualReact } from '@ant-design/pro-utils';
import { runFunction } from '@ant-design/pro-utils';
import { getFieldPropsOrFormItemProps, InlineErrorFormItem } from '@ant-design/pro-utils';
import type { ProColumnType } from '../index';

const SHOW_EMPTY_TEXT_LIST = ['', null, undefined];

/**
 * 拼接用于编辑的 key
 */
export const spellNamePath = (...rest: any[]): React.Key[] => {
  return rest
    .filter((index) => index !== undefined)
    .map((item) => {
      if (typeof item === 'number') {
        return item.toString();
      }
      return item;
    })
    .flat(1);
};

type CellRenderFromItemProps<T> = {
  text: string | number | React.ReactText[];
  valueType: ProColumnType['valueType'];
  index: number;
  rowData?: T;
  columnEmptyText?: ProFieldEmptyText;
  columnProps?: ProColumnType<T> & {
    entity: T;
  };
  type?: ProSchemaComponentTypes;
  // 行的唯一 key
  recordKey?: React.Key;
  mode: 'edit' | 'read';
  /**
   * If there is, use EditableTable in the Form
   */
  prefixName?: string;
  counter: ReturnType<typeof useContainer>;
  proFieldProps: ProFormFieldProps;
};

const CellRenderFromItem = <T,>(props: CellRenderFromItemProps<T>) => {
  /**
   * memo cannot use generics type, so wrap it
   */
  const Component = useMemo(
    () =>
      memo<CellRenderFromItemProps<T>>(
        ({ columnProps, prefixName, text, counter, rowData, index, recordKey, proFieldProps }) => {
          const key = recordKey || index;
          const [name, setName] = useState<React.Key[]>([]);

          const rowName = useMemo(() => {
            return name.slice(0, -1);
          }, [name]);

          useEffect(() => {
            const value = spellNamePath(
              prefixName,
              prefixName ? index : key,
              columnProps?.key ?? columnProps?.dataIndex ?? index,
            );

            setName(value);
          }, [columnProps?.dataIndex, columnProps?.key, index, recordKey, prefixName, key]);

          const needProps = useMemo(
            () =>
              [
                counter?.editableForm,
                {
                  ...columnProps,
                  rowKey: rowName,
                  rowIndex: index,
                  isEditable: true,
                },
              ] as const,
            [columnProps, counter?.editableForm, index, rowName],
          );

          const formItemProps = useMemo(
            () => getFieldPropsOrFormItemProps(columnProps?.formItemProps, ...needProps),
            [columnProps?.formItemProps, needProps],
          );

          const messageVariables = useMemo(
            () => ({
              label: (columnProps?.title as string) || '此项',
              type: (columnProps?.valueType as string) || '文本',
              ...formItemProps?.messageVariables,
            }),
            [columnProps?.title, columnProps?.valueType, formItemProps?.messageVariables],
          );

          const initialValue = useMemo(() => {
            const _value = formItemProps?.initialValue ?? columnProps?.initialValue;
            if (prefixName) return _value;
            return text ?? _value;
          }, [columnProps?.initialValue, formItemProps?.initialValue, prefixName, text]);

          const InlineItem = useCallback<React.FC>(
            ({ children }) => (
              <InlineErrorFormItem
                key={key}
                errorType="popover"
                name={name}
                {...formItemProps}
                messageVariables={messageVariables}
                initialValue={initialValue}
              >
                {children}
              </InlineErrorFormItem>
            ),
            [key, name, formItemProps, messageVariables, initialValue],
          );

          const generateFormItem = useCallback(() => {
            const inputDom = (
              <ProFormField
                cacheForSwr
                key={key}
                name={name}
                proFormFieldKey={key}
                ignoreFormItem
                fieldProps={getFieldPropsOrFormItemProps(columnProps?.fieldProps, ...needProps)}
                {...proFieldProps}
              />
            );

            /**
             * 如果没有自定义直接返回
             */
            if (!columnProps?.renderFormItem) {
              return <InlineItem>{inputDom}</InlineItem>;
            }

            const renderDom = columnProps.renderFormItem?.(
              {
                ...columnProps,
                index,
                isEditable: true,
                type: 'table',
              },
              {
                defaultRender: () => <InlineItem>{inputDom}</InlineItem>,
                type: 'form',
                recordKey,
                record: {
                  ...rowData,
                  ...counter?.editableForm?.getFieldValue([key]),
                },
                isEditable: true,
              },
              counter?.editableForm as any,
            );

            return <InlineItem>{renderDom}</InlineItem>;
          }, [
            key,
            InlineItem,
            columnProps,
            counter?.editableForm,
            index,
            name,
            needProps,
            proFieldProps,
            recordKey,
            rowData,
          ]);

          if (name.length === 0) {
            return null;
          }

          if (
            typeof columnProps?.renderFormItem === 'function' ||
            typeof columnProps?.fieldProps === 'function' ||
            typeof columnProps?.formItemProps === 'function'
          ) {
            return (
              <ProFormDependency name={[rowName]}>{() => generateFormItem()}</ProFormDependency>
            );
          }
          return generateFormItem();
        },
        (nextProps, preProps) => {
          return isDeepEqualReact(nextProps, preProps, [
            'onChange',
            'counter',
            'render',
            'tableColumn',
          ]);
        },
      ),
    [],
  );

  return <Component {...props} />;
};

/**
 * 根据不同的类型来转化数值
 *
 * @param text
 * @param valueType
 */
function cellRenderToFromItem<T>(config: CellRenderFromItemProps<T>): React.ReactNode {
  const { text, valueType, rowData, columnProps } = config;

  // 如果 valueType === text ，没必要多走一次 render
  if (
    (!valueType || ['textarea', 'text'].includes(valueType.toString())) &&
    // valueEnum 存在说明是个select
    !columnProps?.valueEnum &&
    config.mode === 'read'
  ) {
    // 如果是''、null、undefined 显示columnEmptyText
    return SHOW_EMPTY_TEXT_LIST.includes(text as any) ? config.columnEmptyText : text;
  }

  if (typeof valueType === 'function' && rowData) {
    // 防止valueType是函数,并且text是''、null、undefined跳过显式设置的columnEmptyText
    return cellRenderToFromItem({
      ...config,
      valueType: valueType(rowData, config.type) || 'text',
    });
  }

  const columnKey = columnProps?.key || columnProps?.dataIndex?.toString();

  /** 生成公用的 proField dom 配置 */
  const proFieldProps: ProFormFieldProps = {
    valueEnum: runFunction<[T | undefined]>(columnProps?.valueEnum, rowData),
    request: columnProps?.request,
    params: runFunction(columnProps?.params, rowData, columnProps),
    readonly: columnProps?.readonly,
    text: valueType === 'index' || valueType === 'indexBorder' ? config.index : text,
    mode: config.mode,
    renderFormItem: undefined,
    valueType: valueType as ProFieldValueType,
    // @ts-ignore
    record: rowData,
    proFieldProps: {
      emptyText: config.columnEmptyText,
      proFieldKey: columnKey ? `table-field-${columnKey}` : undefined,
    },
  };

  /** 只读模式直接返回就好了，不需要处理 formItem */
  if (config.mode !== 'edit') {
    return (
      <ProFormField
        mode="read"
        ignoreFormItem
        fieldProps={getFieldPropsOrFormItemProps(columnProps?.fieldProps, null, columnProps)}
        {...proFieldProps}
      />
    );
  }
  return <CellRenderFromItem<T> key={config.recordKey} {...config} proFieldProps={proFieldProps} />;
}

export default cellRenderToFromItem;
