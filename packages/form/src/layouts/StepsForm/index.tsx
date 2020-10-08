import React, { useRef, useCallback, useState, useEffect, useContext } from 'react';
import { Form, Steps, ConfigProvider, Button, Space } from 'antd';
import toArray from 'rc-util/lib/Children/toArray';
import { FormProviderProps } from 'antd/lib/form/context';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { StepsProps } from 'antd/lib/steps';
import classNames from 'classnames';
import { FormInstance } from 'antd/lib/form';

import StepFrom, { StepFromProps } from './StepForm';
import './index.less';
import { ProFormProps } from '../ProForm';
import { CommonFormProps } from '../../BaseForm';

type Store = {
  [name: string]: any;
};

interface StepsFormProps<T = Store> extends FormProviderProps {
  onFinish?: (values: T) => Promise<void>;
  current?: number;
  stepsProps?: StepsProps;
  formProps?: ProFormProps;
  onCurrentChange?: (current: number) => void;
  /**
   * 自定义步骤器
   */
  renderSteps?: (
    steps: Array<{
      key: string;
      title?: React.ReactNode;
    }>,
    defaultDom: React.ReactNode,
  ) => React.ReactNode;

  /**
   * 自定义单个表单
   * @param form from 的 dom，可以放置到别的位置
   */
  renderStepForm?: (from: React.ReactNode) => React.ReactNode;

  /**
   * 自定义整个表单区域
   * @param form from 的 dom，可以放置到别的位置
   * @param submitter 操作按钮
   */
  renderStepsForm?: (from: React.ReactNode, submitter: React.ReactNode) => React.ReactNode;
  /**
   * 按钮的统一配置，优先级低于分布表单的配置
   */
  submitter?: CommonFormProps['submitter'];
}

export const StepsFormProvide = React.createContext<
  | {
      unRegForm: (name: string) => void;
      onFormFinish: (name: string, formData: any) => void;
      keyArray: string[];
      formArrayRef: React.MutableRefObject<
        Array<React.MutableRefObject<FormInstance<any> | undefined>>
      >;
      loading: boolean;
      setLoading: React.Dispatch<React.SetStateAction<boolean>>;
      formMapRef: React.MutableRefObject<Map<string, StepFromProps>>;
      next: () => void;
    }
  | undefined
>(undefined);

const StepsForm: React.FC<StepsFormProps> & {
  StepFrom: typeof StepFrom;
  useForm: typeof Form.useForm;
} = (props) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-steps-form');

  const {
    current,
    onCurrentChange,
    submitter,
    renderStepsForm,
    renderSteps,
    renderStepForm,
    stepsProps,
    onFinish,
    formProps,
    ...rest
  } = props;

  const formDataRef = useRef(new Map<string, Store>());
  const formMapRef = useRef(new Map<string, StepFromProps>());
  const formArrayRef = useRef<Array<React.MutableRefObject<FormInstance<any> | undefined>>>([]);
  const [formArray, setFormArray] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * 受控的方式来操作表单
   */
  const [step, setStep] = useMergedState<number>(0, {
    value: props.current,
    onChange: props.onCurrentChange,
  });

  /**
   * 注册一个form进入，方便进行 props 的修改
   */
  const regForm = useCallback((name: string, childrenFormProps: StepFromProps) => {
    formMapRef.current.set(name, childrenFormProps);
  }, []);

  /**
   * 接触挂载掉这个 form，同时步数 -1
   */
  const unRegForm = useCallback((name: string) => {
    formMapRef.current.delete(name);
    formDataRef.current.delete(name);
  }, []);

  /**
   * children 计算完成之后，重新生成一下当前的步骤列表
   */
  useEffect(() => {
    setFormArray(Array.from(formMapRef.current.keys()));
  }, [Array.from(formMapRef.current.keys()).join(',')]);

  /**
   * proForm处理了一下 from 的数据，在其中做了一些操作
   * 如果使用 Provider 自带的，自带的数据处理就无法生效了
   */
  const onFormFinish = useCallback(
    async (name: string, formData: any) => {
      formDataRef.current.set(name, formData);
      // 如果是最后一步
      if (step === formArray.length - 1) {
        if (!props.onFinish) {
          return;
        }
        setLoading(true);
        const values = Array.from(formDataRef.current.values()).reduce((pre, cur) => {
          return {
            ...pre,
            ...cur,
          };
        }, {});
        await props.onFinish(values);
        setLoading(false);
      }
    },
    [step],
  );

  const stepsDom = (
    <div
      className={`${prefixCls}-steps-container`}
      style={{
        maxWidth: Math.min(formArray.length * 320, 1160),
      }}
    >
      <Steps {...stepsProps} current={step} onChange={undefined}>
        {formArray.map((item) => {
          const itemProps = formMapRef.current.get(item);
          return <Steps.Step key={item} title={itemProps?.title} />;
        })}
      </Steps>
    </div>
  );
  const onSubmit = () => {
    const from = formArrayRef.current[step];
    from.current?.submit();
  };
  const next = submitter !== false && (
    <Button
      key="next"
      type="primary"
      loading={loading}
      {...submitter?.submitButtonProps}
      onClick={() => {
        submitter?.onSubmit?.();
        onSubmit();
      }}
    >
      下一步
    </Button>
  );

  const pre = submitter !== false && (
    <Button
      key="pre"
      {...submitter?.resetButtonProps}
      onClick={() => {
        // 没有判断是因为 step<1 这个按钮不显示
        setStep(step - 1);
        submitter?.onReset?.();
      }}
    >
      上一步
    </Button>
  );

  const submit = submitter !== false && (
    <Button
      key="submit"
      type="primary"
      loading={loading}
      {...submitter?.submitButtonProps}
      onClick={() => {
        submitter?.onSubmit?.();
        onSubmit();
      }}
    >
      提交
    </Button>
  );

  const getActionButton = () => {
    const index = step || 0;
    if (index < 1) {
      return [next] as JSX.Element[];
    }
    if (index + 1 === formArray.length) {
      return [pre, submit] as JSX.Element[];
    }
    return [pre, next] as JSX.Element[];
  };

  const renderSubmitter = () => {
    const submitterDom = getActionButton();
    if (submitter && submitter.render) {
      const submitterProps: any = {
        form: formArrayRef.current[step],
        onSubmit,
        onReset: () => {
          if (step < 1) {
            return;
          }
          setStep(step - 1);
        },
      };
      return submitter.render(submitterProps, submitterDom) as React.ReactNode;
    }
    if (submitter && submitter?.render === false) {
      return null;
    }
    return submitterDom;
  };

  const formDom = toArray(props.children).map((item, index) => {
    const itemProps = item.props as StepFromProps;
    const name = itemProps.name || `${index}`;
    regForm(name, itemProps);
    /**
     * 是否是当前的表单
     */
    const isShow = step === index;

    const config = isShow
      ? {
          contentRender: renderStepForm,
          submitter: false,
        }
      : {};
    return (
      <div
        className={classNames(`${prefixCls}-step`, {
          [`${prefixCls}-step-active`]: isShow,
        })}
        key={name}
      >
        {React.cloneElement(item, {
          ...config,
          ...formProps,
          ...itemProps,
          name,
          step: index,
          key: name,
        })}
      </div>
    );
  });
  const finalStepsDom = props.renderSteps
    ? props.renderSteps(
        formArray.map((item) => ({
          key: item,
          title: formMapRef.current.get(item)?.title,
        })),
        stepsDom,
      )
    : stepsDom;

  const submitterDom = renderSubmitter();

  return (
    <div className={prefixCls}>
      <Form.Provider {...rest}>
        <StepsFormProvide.Provider
          value={{
            loading,
            setLoading,
            keyArray: formArray,
            next: () => {
              if (step > formArray.length - 2) {
                return;
              }
              setStep(step + 1);
            },
            formArrayRef,
            formMapRef,
            unRegForm,
            onFormFinish,
          }}
        >
          {renderStepsForm ? (
            renderStepsForm(
              <>
                {finalStepsDom}
                <div className={`${prefixCls}-container`}>{formDom}</div>
              </>,
              submitterDom,
            )
          ) : (
            <>
              {finalStepsDom}
              <div className={`${prefixCls}-container`}>
                {formDom}
                <Space>{renderSubmitter()}</Space>
              </div>
            </>
          )}
        </StepsFormProvide.Provider>
      </Form.Provider>
    </div>
  );
};

StepsForm.StepFrom = StepFrom;
StepsForm.useForm = Form.useForm;

export type { StepFromProps, StepsFormProps };

export default StepsForm;
