import type { CSSInterpolation } from '@ant-design/cssinjs';
import { useStyleRegister } from '@ant-design/cssinjs';
import { theme as antdTheme } from 'antdV5';
import type { AliasToken } from 'antdV5/es/theme';
import type React from 'react';

const { useToken } = antdTheme;

export type UseStyleResult = {
  wrapSSR: (node: React.ReactElement) => React.ReactElement;
  hashId: string;
};

export default function useStyle(
  componentName: string,
  styleFn: (token: AliasToken) => CSSInterpolation,
): UseStyleResult {
  const { token, hashId, theme } = useToken();
  return {
    wrapSSR: useStyleRegister({ theme, token, hashId, path: [componentName] }, () =>
      styleFn(token),
    ),
    hashId,
  };
}
