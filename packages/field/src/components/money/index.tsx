import React from 'react';
import { InputNumber } from 'antd';
import { FieldFC } from '../../index';

const moneyIntl = new Intl.NumberFormat('zh-Hans-CN', {
  currency: 'CNY',
  style: 'currency',
  minimumFractionDigits: 2,
});

const enMoneyIntl = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const ruMoneyIntl = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
});
const msMoneyIntl = new Intl.NumberFormat('ms-MY', {
  style: 'currency',
  currency: 'MYR',
});

const getTextByLocale = (locale: string, paramsText: number) => {
  let text = paramsText;
  if (typeof text === 'string') {
    text = Number(text);
  }
  if (locale === 'en_US') {
    // english
    return enMoneyIntl.format(text);
  }
  // russian
  if (locale === 'ru_RU') {
    return ruMoneyIntl.format(text);
  }
  // malay
  if (locale === 'ms_MY') {
    return msMoneyIntl.format(text);
  }
  return moneyIntl.format(text);
};

export type FieldMoneyProps = {
  text: number;
  moneySymbol?: string;
  locale?: string;
};

/**
 * 金额组件
 * @param FieldMoneyProps
 * {
 *    text: number;
 *    moneySymbol?: string;
 * }
 */
const FieldMoney: FieldFC<FieldMoneyProps> = ({
  text,
  mode: type,
  moneySymbol = '￥',
  locale = '',
  render,
  renderFormItem,
  formItemProps,
}) => {
  if (type === 'read') {
    const dom = <span>{getTextByLocale(locale, text)}</span>;
    if (render) {
      return render(text, { mode: type, ...formItemProps }, dom);
    }
    return dom;
  }
  if (type === 'edit' || type === 'update') {
    const dom = (
      <InputNumber
        defaultValue={text}
        min={0}
        precision={2}
        formatter={value => {
          if (value) {
            return `${moneySymbol} ${value}`.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ',',
            );
          }
          return '';
        }}
        parser={value =>
          value
            ? value.replace(new RegExp(`\\${moneySymbol}\\s?|(,*)`, 'g'), '')
            : ''
        }
        style={{
          width: '100%',
        }}
        {...formItemProps}
      />
    );
    if (renderFormItem) {
      return renderFormItem(text, { mode: type, ...formItemProps }, dom);
    }
    return dom;
  }
  return null;
};

export default FieldMoney;
