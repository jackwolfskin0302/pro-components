import { ProFormFieldSet } from '../../../index';
import type { ProSchemaRenderValueTypeFunction } from '../typing';

export const formSet: ProSchemaRenderValueTypeFunction = (item, { genItems }) => {
  if (item.valueType === 'formSet' && item.dataIndex) {
    if (!item.columns || !Array.isArray(item.columns)) return null;
    return (
      <ProFormFieldSet
        {...item.getFormItemProps?.()}
        key={item.key}
        initialValue={item.initialValue}
        name={item.dataIndex}
        label={item.label}
        {...item.getFieldProps?.()}
      >
        {genItems(item.columns)}
      </ProFormFieldSet>
    );
  }

  return true;
};
