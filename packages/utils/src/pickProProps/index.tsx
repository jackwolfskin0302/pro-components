const proFieldProps = `valueType request mode plain renderFromItem render text formItemProps valueEnum`;

const proFormProps = `fieldProps labelCol secondary colSize groupProps contentRender submitterProps submitter`;

export default function pickProProps(props: object) {
  const propList = `${proFieldProps} ${proFormProps}`.split(/[\s\n]+/);

  const attrs = {};
  Object.keys(props || {}).forEach((key) => {
    if (propList.includes(key)) {
      return;
    }
    attrs[key] = props[key];
  });
  return attrs;
}
