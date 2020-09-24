import { render, mount } from 'enzyme';
import React from 'react';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import defaultProps from './defaultProps';
import { waitForComponentToPaint } from '../util';
import { act } from 'react-test-renderer';

describe('BasicLayout', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'zh-CN'),
      },
    });
  });

  it('base use', () => {
    const html = render(
      <ProLayout {...defaultProps}>
        <PageContainer />
      </ProLayout>,
    );
    expect(html).toMatchSnapshot();
  });

  it('content is text', () => {
    const html = render(
      <ProLayout {...defaultProps}>
        <PageContainer content="just so so" />
      </ProLayout>,
    );
    expect(html).toMatchSnapshot();
  });

  it('title=false, don not render title view', async () => {
    const wrapper = mount(
      <ProLayout {...defaultProps}>
        <PageContainer title={false} />
      </ProLayout>,
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('.ant-page-header-heading-title')).toHaveLength(0);
  });

  it('have default title', async () => {
    const wrapper = mount(
      <ProLayout {...defaultProps}>
        <PageContainer />
      </ProLayout>,
    );
    await waitForComponentToPaint(wrapper);
    const titleDom = wrapper.find('.ant-page-header-heading-title');
    expect(titleDom.text()).toEqual('welcome');
  });

  it('title overrides the default title', async () => {
    const wrapper = mount(
      <ProLayout {...defaultProps}>
        <PageContainer title="name" />
      </ProLayout>,
    );
    await waitForComponentToPaint(wrapper);
    const titleDom = wrapper.find('.ant-page-header-heading-title');
    expect(titleDom.text()).toEqual('name');
  });

  it('with default prefixCls props TopNavHeader', async () => {
    const wrapper = mount(
      <ProLayout
        {...defaultProps}
        layout="mix"
        splitMenus
        isMobile={false}
        rightContentRender={() => <span />}
      >
        <PageContainer title="name" />
      </ProLayout>,
    );
    await waitForComponentToPaint(wrapper);
    const domHeader = wrapper.find('.ant-pro-top-nav-header-logo');

    act(() => {
      wrapper.setProps({
        rightContentRender: () => (
          <div
            style={{
              width: 200,
            }}
          >
            xx
          </div>
        ),
      });
    });
    expect(domHeader.exists()).toBe(true);
  });

  it('without custom prefixCls props TopNavHeader', async () => {
    const prefixCls = 'ant-oh-pro';
    const wrapper = mount(
      <ProLayout {...defaultProps} layout="top" prefixCls={prefixCls}>
        <PageContainer title="name" />
      </ProLayout>,
    );
    await waitForComponentToPaint(wrapper);
    const domHeader = wrapper.find(`.${prefixCls}-top-nav-header-logo`);
    expect(domHeader.exists()).toBe(true);
  });

  it('pageHeaderRender return false', async () => {
    const wrapper = mount(
      <ProLayout {...defaultProps} layout="top">
        <PageContainer title="name" pageHeaderRender={() => null} />
      </ProLayout>,
    );
    await waitForComponentToPaint(wrapper);
    const domHeader = wrapper.find('ant-page-header');
    expect(domHeader.exists()).toBeFalsy();
    wrapper.unmount();
  });
});
