import React, { useState } from 'react';
import { Switch, Avatar } from 'antd';
import ProLayout, {
  PageHeaderWrapper,
  DefaultFooter,
  // eslint-disable-next-line import/no-unresolved
} from '@ant-design/pro-layout';
import defaultProps from './defaultProps';

export default () => {
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [menu, setMenu] = useState(true);
  const [header, setHeader] = useState(true);
  const [footer, setFooter] = useState(true);
  const [menuHeader, setMenuHeader] = useState(true);
  const [right, setRight] = useState(true);
  const [collapsedButtonRender, setCollapsedButtonRender] = useState(true);
  return (
    <>
      <Switch
        checked={loading}
        onChange={e => setLoading(e)}
        style={{
          margin: 8,
        }}
      />
      loading 状态
      <Switch
        checked={collapsed}
        onChange={e => setCollapsed(e)}
        style={{
          margin: 8,
        }}
      />
      折叠layout
      <Switch
        checked={menu}
        onChange={e => setMenu(e)}
        style={{
          margin: 8,
        }}
      />
      显示菜单
      <Switch
        checked={collapsedButtonRender}
        onChange={e => setCollapsedButtonRender(e)}
        style={{
          margin: 8,
        }}
      />
      显示折叠按钮
      <Switch
        checked={header}
        onChange={e => setHeader(e)}
        style={{
          margin: 8,
        }}
      />
      显示顶栏
      <Switch
        checked={menuHeader}
        onChange={e => setMenuHeader(e)}
        style={{
          margin: 8,
        }}
      />
      显示菜单头
      <Switch
        checked={footer}
        onChange={e => setFooter(e)}
        style={{
          margin: 8,
        }}
      />
      显示页脚
      <Switch
        checked={right}
        onChange={e => setRight(e)}
        style={{
          margin: 8,
        }}
      />
      显示顶栏右侧
      <br />
      <br />
      <ProLayout
        {...defaultProps}
        style={{
          height: 500,
        }}
        menuHeaderRender={menuHeader ? undefined : false}
        headerRender={header ? undefined : false}
        collapsedButtonRender={collapsedButtonRender ? undefined : false}
        menuRender={(_, dom) => (menu ? dom : null)}
        breakpoint={false}
        collapsed={collapsed}
        loading={loading}
        onCollapse={setCollapsed}
        rightContentRender={() =>
          right ? (
            <div>
              <Avatar src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />
            </div>
          ) : null
        }
        location={{
          pathname: '/welcome',
        }}
        footerRender={() => (footer ? <DefaultFooter /> : null)}
      >
        <PageHeaderWrapper content="欢迎使用">Hello World</PageHeaderWrapper>
      </ProLayout>
    </>
  );
};
