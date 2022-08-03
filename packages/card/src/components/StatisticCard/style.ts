﻿import type { ProAliasToken } from '@ant-design/pro-utils';
import { useStyle as useAntdStyle } from '@ant-design/pro-utils';
import type { GenerateStyle } from 'antd/es/theme';

export interface ProListToken extends ProAliasToken {
  componentCls: string;
}

const genProStyle: GenerateStyle<ProListToken> = (token) => {
  return {
    [token.componentCls]: {
      '&-chart': {
        display: 'flex',
        flexDirection: 'column',
        marginBlockStart: 8,
        marginBlockEnd: 8,
        '&-left': { marginBlockStart: '0', marginInlineEnd: '16px' },
        '&-right': { marginBlockStart: '0', marginInlineStart: '16px' },
      },
      '&-content': {
        display: 'flex',
        flexDirection: 'column',
        '&-horizonta': {
          flexDirection: 'row',
          [`${token.componentCls}-chart`]: { alignItems: 'center', alignSelf: 'flex-start' },
        },
      },
      '&-footer': {
        marginBlockStart: 8,
        paddingBlockStart: '16px',
        borderTop: `rgba(0, 0, 0, 0.08) solid ${token.colorBorder}`,
      },
    },
  };
};

export function useStyle(prefixCls: string) {
  return useAntdStyle('CheckCard', (token) => {
    const proListToken: ProListToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genProStyle(proListToken)];
  });
}
