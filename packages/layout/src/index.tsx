import { FooterToolbar } from './components/FooterToolbar';
import { GridContent } from './components/GridContent';
import type { PageContainerProps } from './components/PageContainer';
import { PageContainer, ProBreadcrumb, ProPageHeader } from './components/PageContainer';
import type { PageHeaderProps } from './components/PageHeader';
import { PageHeader } from './components/PageHeader';

import type { FooterProps } from './components/Footer';
import { DefaultFooter } from './components/Footer';
import type { HeaderViewProps as HeaderProps } from './components/Header';
import { DefaultHeader } from './components/Header';
import { PageLoading } from './components/PageLoading';
import type { SettingDrawerProps, SettingDrawerState } from './components/SettingDrawer';
import { SettingDrawer } from './components/SettingDrawer';
import type { TopNavHeaderProps } from './components/TopNavHeader';
import { TopNavHeader } from './components/TopNavHeader';
import { WaterMark } from './components/WaterMark';
import type { RouteContextType } from './context/RouteContext';
import { RouteContext } from './context/RouteContext';
import { getPageTitle } from './getPageTitle';
import type { ProLayoutProps } from './ProLayout';
import { ProLayout } from './ProLayout';
import { getMenuData } from './utils/getMenuData';

export type { ProSettings, ProSettings as Settings } from './defaultSettings';
export type { MenuDataItem } from './typings';
export {
  PageHeader,
  ProLayout,
  RouteContext,
  PageLoading,
  GridContent,
  DefaultHeader,
  TopNavHeader,
  DefaultFooter,
  SettingDrawer,
  getPageTitle,
  getMenuData,
  PageContainer,
  FooterToolbar,
  WaterMark,
  ProPageHeader,
  ProBreadcrumb,
};
export type {
  FooterProps,
  PageHeaderProps,
  PageContainerProps,
  TopNavHeaderProps,
  ProLayoutProps,
  RouteContextType,
  HeaderProps,
  SettingDrawerProps,
  SettingDrawerState,
};

export default ProLayout;
