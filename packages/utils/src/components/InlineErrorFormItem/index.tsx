﻿import React from 'react';
import { Form, Popover, Progress, Space } from 'antd';
import type { FormItemProps, PopoverProps, ProgressProps } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import type { Rule, NamePath } from 'rc-field-form/lib/interface';

const RED = '#ff4d4f';
const YELLOW = '#faad14';
const GREEN = '#52c41a';
const PRIMARY = '#1890ff';
const COLORS = { RED, YELLOW, GREEN, PRIMARY };

const getStrokeColor = (percent: number) => {
  if (percent < 30) {
    return COLORS.RED;
  }
  if (percent < 60) {
    return COLORS.YELLOW;
  }
  return COLORS.GREEN;
};

const CircleRender = () => {
  return (
    <div
      style={{
        width: 14,
        height: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '4px',
          backgroundColor: 'rgba(0,0,0,0.45)',
        }}
      />
    </div>
  );
};

const getIcon = (fieldError: string[], value: any, rule: Rule, isTouched: boolean) => {
  if (!value || !isTouched) {
    return <CircleRender></CircleRender>;
  }
  if (fieldError.includes((rule as any).message)) {
    return <CloseCircleFilled style={{ color: COLORS.RED }} />;
  }
  return <CheckCircleFilled style={{ color: COLORS.GREEN }} />;
};

const Content: React.FC<{
  fieldError: string[];
  value: any;
  isValidating: boolean;
  isTouched: boolean;
  rules: Rule[];
  progressProps?: ProgressProps | false;
}> = ({ rules, isTouched, isValidating, value, fieldError, progressProps }) => {
  const percent = Math.max(
    0,
    Math.min(100, ((rules.length - fieldError.length) / rules.length) * 100),
  );
  return (
    <div style={{ padding: '6px 8px 12px 8px' }}>
      {(progressProps === undefined || progressProps) && (
        <Progress
          percent={value && isTouched ? percent : 0}
          strokeColor={getStrokeColor(percent)}
          showInfo={false}
          size="small"
          {...progressProps}
        />
      )}
      <ul style={{ margin: 0, marginTop: '10px', listStyle: 'none', padding: '0' }}>
        {rules?.map((rule, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            <Space>
              {isValidating ? (
                <LoadingOutlined style={{ color: COLORS.PRIMARY }} />
              ) : (
                getIcon(fieldError, value, rule, isTouched)
              )}
              <span style={{ color: 'rgba(0,0,0,0.65)' }}>{(rule as any).message}</span>
            </Space>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface InlineErrorFormItemProps extends FormItemProps {
  errorType?: 'popover' | 'default';
  popoverProps?: PopoverProps;
  progressProps?: ProgressProps | false;
}

interface InternalProps extends InlineErrorFormItemProps {
  name: NamePath;
  rules: Rule[];
}

const FIX_INLINE_STYLE = {
  marginTop: -5,
  marginBottom: -5,
  marginLeft: 0,
  marginRight: 0,
};

const InlineErrorFormItem: React.FC<InternalProps> = ({
  label,
  rules,
  name,
  children,
  popoverProps,
  progressProps,
  ...rest
}) => {
  return (
    <Form.Item style={FIX_INLINE_STYLE} noStyle shouldUpdate help={''} label={label}>
      {(form) => {
        const fieldError = form.getFieldError(name);
        const value = form.getFieldValue(name);
        const isValidating = form.isFieldValidating(name);
        const isTouched = form.isFieldTouched(name);
        return (
          <Popover
            trigger={popoverProps?.trigger || 'focus'}
            placement={popoverProps?.placement}
            content={
              <Content
                fieldError={fieldError}
                value={value}
                isValidating={isValidating}
                isTouched={isTouched}
                rules={rules}
                progressProps={progressProps}
              />
            }
          >
            <div
              style={{
                margin: '-5px 0',
              }}
            >
              <Form.Item noStyle preserve={false} name={name} rules={rules} {...rest}>
                {children}
              </Form.Item>
            </div>
          </Popover>
        );
      }}
    </Form.Item>
  );
};

export default (props: InlineErrorFormItemProps) => {
  const { errorType, rules, name, popoverProps, children, progressProps, ...rest } = props;
  if (name && rules?.length && errorType === 'popover') {
    return (
      <InlineErrorFormItem
        name={name}
        rules={rules!}
        popoverProps={popoverProps}
        progressProps={progressProps}
        {...rest}
      >
        {children}
      </InlineErrorFormItem>
    );
  }
  return (
    <Form.Item rules={rules} {...rest} style={{ ...FIX_INLINE_STYLE, ...rest.style }} name={name}>
      {children}
    </Form.Item>
  );
};
