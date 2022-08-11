﻿import type { ProAliasToken } from '@ant-design/pro-utils';
import { useStyle as useAntdStyle } from '@ant-design/pro-utils';
import type { GenerateStyle } from 'antd/es/theme';
import { useContext } from 'react';
import type { BaseLayoutDesignToken } from '../../../context/ProLayoutContext';
import { ProLayoutContext } from '../../../context/ProLayoutContext';
export interface ProLayoutBaseMenuToken extends ProAliasToken {
  componentCls: string;
}

const genProLayoutBaseMenuStyle: GenerateStyle<
  ProLayoutBaseMenuToken & BaseLayoutDesignToken['sider']
> = (token) => {
  return {
    [token.componentCls]: {
      background: 'transparent',
      border: 'none',
      [`&-collapsed`]: {
        [`${token.antCls}-menu-item, 
        ${token.antCls}-menu-item-group > ${token.antCls}-menu-item-group-list > ${token.antCls}-menu-item, 
        ${token.antCls}-menu-item-group > ${token.antCls}-menu-item-group-list > ${token.antCls}-menu-submenu > ${token.antCls}-menu-submenu-title, 
        ${token.antCls}-menu-submenu > ${token.antCls}-menu-submenu-title`]: {
          paddingInline: '16px !important',
        },
        [`${token.antCls}-menu-item-group > ${token.antCls}-menu-item-group-list > ${token.antCls}-menu-submenu-selected > ${token.antCls}-menu-submenu-title, 
        ${token.antCls}-menu-submenu-selected > ${token.antCls}-menu-submenu-title`]: {
          backgroundColor: token.colorBgMenuItemSelected,
          borderRadius: token.radiusBase,
        },
        [`${token.componentCls}-group`]: {
          [`${token.antCls}-menu-item-group-title`]: {
            paddingInline: 0,
          },
        },
      },
      '&-group': {
        [`${token.antCls}-menu-item-group-title`]: {
          fontSize: 12,
          color: token.colorTextLabel,
          '.anticon': {
            marginInlineEnd: 8,
          },
        },
      },
      '&-group-divider': {
        color: token.colorTextSecondary,
        fontSize: 12,
        lineHeight: 20,
      },
    },
  };
};

export function useStyle(prefixCls: string) {
  const { sider } = useContext(ProLayoutContext);
  return useAntdStyle('pro-layout-base-menu', (token) => {
    const proLayoutMenuToken: ProLayoutBaseMenuToken & BaseLayoutDesignToken['sider'] = {
      ...token,
      componentCls: `.${prefixCls}`,
      ...sider,
    };
    return [genProLayoutBaseMenuStyle(proLayoutMenuToken)];
  });
}
