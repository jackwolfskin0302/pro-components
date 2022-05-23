import { getFlatMenus } from '@umijs/route-utils';
import { Drawer } from 'antd';
import classNames from 'classnames';
import Omit from 'omit.js';
import React, { useEffect } from 'react';
import { MenuCounter } from './Counter';
import type { PrivateSiderMenuProps, SiderMenuProps } from './SiderMenu';
import { SiderMenu } from './SiderMenu';

const SiderMenuWrapper: React.FC<SiderMenuProps & PrivateSiderMenuProps> = (props) => {
  const {
    isMobile,
    menuData,
    siderWidth,
    collapsed,
    onCollapse,
    style,
    className,
    hide,
    getContainer,
    prefixCls,
    matchMenuKeys,
  } = props;
  const { setFlatMenuKeys } = MenuCounter.useContainer();

  useEffect(() => {
    if (!menuData || menuData.length < 1) {
      return;
    }
    // 当 menu data 改变的时候重新计算这两个参数
    const newFlatMenus = getFlatMenus(menuData);
    setFlatMenuKeys(Object.keys(newFlatMenus));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchMenuKeys.join('-')]);

  useEffect(() => {
    if (isMobile === true) {
      onCollapse?.(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const omitProps = Omit(props, ['className', 'style']);

  if (hide) {
    return null;
  }
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      className={classNames(`${prefixCls}-drawer-sider`, className)}
      onClose={() => onCollapse?.(true)}
      style={{
        padding: 0,
        height: '100vh',
        ...style,
      }}
      handler={<div />}
      closable={false}
      getContainer={getContainer}
      width={siderWidth}
      bodyStyle={{ height: '100vh', padding: 0, display: 'flex', flexDirection: 'row' }}
    >
      <SiderMenu
        {...omitProps}
        isMobile={true}
        className={classNames(`${prefixCls}-sider`, className)}
        collapsed={isMobile ? false : collapsed}
        splitMenus={false}
        originCollapsed={collapsed}
      />
    </Drawer>
  ) : (
    <SiderMenu
      className={classNames(`${prefixCls}-sider`, className)}
      originCollapsed={collapsed}
      {...omitProps}
      style={style}
    />
  );
};

export { SiderMenuWrapper as SiderMenu };
