import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import ProTable from '@ant-design/pro-table';
import { getFetchData } from './demo';
import { waitForComponentToPaint } from '../util';

describe('BasicTable Search', () => {
  const LINE_STR_COUNT = 20;
  // Mock offsetHeight
  // @ts-expect-error
  const originOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
    .get;
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    get() {
      let html = this.innerHTML;
      html = html.replace(/<[^>]*>/g, '');
      const lines = Math.ceil(html.length / LINE_STR_COUNT);
      return lines * 16;
    },
  });

  // Mock getComputedStyle
  const originGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (ele) => {
    const style = originGetComputedStyle(ele);
    style.lineHeight = '16px';
    return style;
  };

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get: originOffsetHeight,
    });
    window.getComputedStyle = originGetComputedStyle;
  });

  it('🎏 filter test', async () => {
    const fn = jest.fn();
    const html = mount(
      <ProTable
        size="small"
        columns={[
          {
            title: 'Name',
            key: 'name',
            dataIndex: ['name', 'money'],
          },
          {
            title: '状态',
            dataIndex: 'status',
            hideInForm: true,
            filters: true,
            valueEnum: {
              0: { text: '关闭', status: 'Default' },
              1: { text: '运行中', status: 'Processing' },
              2: { text: '已上线', status: 'Success' },
              3: { text: '异常', status: 'Error' },
            },
          },
        ]}
        onChange={fn}
        dataSource={getFetchData(60)}
        rowKey="key"
      />,
    );
    await waitForComponentToPaint(html, 200);

    act(() => {
      html.find('span.ant-table-filter-trigger').simulate('click');
    });

    await waitForComponentToPaint(html, 800);
    act(() => {
      html.find('.ant-table-filter-dropdown').debug();
      html.find('span.ant-table-filter-trigger').simulate('click');
      html
        .find('.ant-table-filter-dropdown .ant-dropdown-menu-item')
        .at(0)
        .simulate('click', {
          target: {
            checked: true,
          },
        });
    });

    await waitForComponentToPaint(html, 500);
    act(() => {
      html
        .find('.ant-table-filter-dropdown-btns .ant-btn.ant-btn-primary.ant-btn-sm')
        .simulate('click');
    });

    await waitForComponentToPaint(html, 500);
    expect(fn).toBeCalledTimes(1);
  });

  it('🎏 order test', async () => {
    const fn = jest.fn();
    const html = mount(
      <ProTable<{ money: number }, {}>
        size="small"
        columns={[
          {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.money - b.money,
          },
          {
            title: 'money',
            key: 'money',
            dataIndex: 'money',
            sorter: (a, b) => a.money - b.money,
          },
          {
            title: '状态',
            dataIndex: 'status',
            hideInForm: true,
            filters: true,
            valueEnum: {
              0: { text: '关闭', status: 'Default' },
              1: { text: '运行中', status: 'Processing' },
              2: { text: '已上线', status: 'Success' },
              3: { text: '异常', status: 'Error' },
            },
          },
        ]}
        onChange={fn}
        dataSource={getFetchData(60)}
        rowKey="key"
      />,
    );
    await waitForComponentToPaint(html, 200);

    act(() => {
      html.find('span.ant-table-column-sorter-down').at(0).simulate('click');
      html.find('span.ant-table-column-sorter-down').at(1).simulate('click');
    });

    await waitForComponentToPaint(html, 800);

    act(() => {
      html.find('span.ant-table-column-sorter-down').at(0).simulate('click');
      html.find('span.ant-table-column-sorter-down').at(1).simulate('click');
    });

    await waitForComponentToPaint(html, 500);
    expect(fn).toBeCalledTimes(4);
  });
});
