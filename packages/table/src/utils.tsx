/* eslint-disable @typescript-eslint/naming-convention */
import React, { ReactText, useEffect } from 'react';
import { Tooltip, Typography } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { ProCoreActionType } from '@ant-design/pro-utils';
import { IntlType } from '@ant-design/pro-provider';
import { ProColumns, ProTableProps } from './Table';
import { UseFetchDataAction, RequestData } from './useFetchData';
import { CounterType } from './container';

/**
 * 检查值是否存在
 * 为了 避开 0 和 false
 * @param value
 */
export const checkUndefinedOrNull = (value: any) => value !== undefined && value !== null;

/**
 *  根据 key 和 dataIndex 生成唯一 id
 * @param key 用户设置的 key
 * @param dataIndex 在对象中的数据
 * @param index 序列号，理论上唯一
 */
export const genColumnKey = (key?: React.ReactText | undefined, index?: number): string => {
  if (key) {
    return `${key}`;
  }
  return `${index}`;
};

/**
 * 生成 Ellipsis 的 tooltip
 * @param dom
 * @param item
 * @param text
 */
export const genEllipsis = (dom: React.ReactNode, item: ProColumns<any>, text: string) => {
  if (!item.ellipsis) {
    return dom;
  }
  return (
    <Tooltip title={text}>
      <span>{dom}</span>
    </Tooltip>
  );
};

export const genCopyable = (dom: React.ReactNode, item: ProColumns<any>, text: string) => {
  if (item.copyable || item.ellipsis) {
    return (
      <Typography.Text
        style={{
          maxWidth: '100%',
          margin: 0,
          padding: 0,
        }}
        title=""
        copyable={
          item.copyable && text
            ? {
                text,
                tooltips: ['', ''],
              }
            : undefined
        }
        ellipsis={item.ellipsis}
      >
        {dom}
      </Typography.Text>
    );
  }
  return dom;
};

/**
 * 合并用户 props 和 预设的 props
 * @param pagination
 * @param action
 * @param intl
 */
export const mergePagination = <T, U>(
  pagination: TablePaginationConfig | boolean | undefined = {},
  action: UseFetchDataAction<RequestData<T>>,
  intl: IntlType,
): TablePaginationConfig | false | undefined => {
  if (pagination === false) {
    return false;
  }
  const defaultPagination: TablePaginationConfig | {} =
    typeof pagination === 'object' ? pagination : {};
  const { current, pageSize } = action;

  return {
    showTotal: (all, range) =>
      `${intl.getMessage('pagination.total.range', '第')} ${range[0]}-${range[1]} ${intl.getMessage(
        'pagination.total.total',
        '条/总共',
      )} ${all} ${intl.getMessage('pagination.total.item', '条')}`,
    showSizeChanger: true,
    total: action.total,
    ...(defaultPagination as TablePaginationConfig),
    current,
    pageSize,
    onChange: (page: number, newPageSize?: number) => {
      const { onChange } = pagination as TablePaginationConfig;
      onChange?.(page, newPageSize || 20);
      // pageSize 改变之后就没必要切换页码
      if (newPageSize !== pageSize || current !== page) {
        action.setPageInfo({ pageSize: newPageSize, page });
      }
    },
  };
};

/**
 * 获取用户的 action 信息
 * @param actionRef
 * @param counter
 * @param onCleanSelected
 */
export const useActionType = <T, U = any>(
  ref: ProTableProps<T, any>['actionRef'],
  counter: ReturnType<CounterType>,
  onCleanSelected: () => void,
) => {
  /**
   * 这里生成action的映射，保证 action 总是使用的最新
   * 只需要渲染一次即可
   */
  useEffect(() => {
    const userAction: ProCoreActionType = {
      reload: async (resetPageIndex?: boolean) => {
        const {
          action: { current },
        } = counter;

        // 如果为 true，回到第一页
        if (resetPageIndex) {
          await current?.resetPageIndex();
        }
        await current?.reload();
      },
      reloadAndRest: async () => {
        const {
          action: { current },
        } = counter;

        // reload 之后大概率会切换数据，清空一下选择。
        onCleanSelected();
        // 如果为 true，回到第一页
        await current?.resetPageIndex();
        await current?.reload();
      },
      reset: async () => {
        const {
          action: { current },
        } = counter;
        await current?.reset();
        await current?.reload();
      },
      clearSelected: () => onCleanSelected(),
    };
    if (ref && typeof ref === 'function') {
      ref(userAction);
    }
    if (ref && typeof ref !== 'function') {
      // eslint-disable-next-line no-param-reassign
      ref.current = userAction;
    }
  }, []);
};

type PostDataType<T> = (data: T) => T;

/**
 * 一个转化的 pipeline 列表
 * @param data
 * @param pipeline
 */
export const postDataPipeline = <T, U>(data: T, pipeline: PostDataType<T>[]) => {
  if (pipeline.filter((item) => item).length < 1) {
    return data;
  }
  return pipeline.reduce((pre, postData) => {
    return postData(pre);
  }, data);
};
