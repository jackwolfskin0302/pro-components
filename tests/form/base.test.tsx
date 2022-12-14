import { FontSizeOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ProFormCaptcha,
  ProFormColorPicker,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormDigitRange,
  ProFormField,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { Button, ConfigProvider, Input } from 'antd';
import { mount } from 'enzyme';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { waitForComponentToPaint, waitTime } from '../util';

describe('ProForm', () => {
  it('π¦ submit props actionsRender=false', async () => {
    const wrapper = render(<ProForm submitter={false} />);

    expect(wrapper.asFragment()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('π¦ componentSize is work', async () => {
    const wrapper = render(
      <ConfigProvider componentSize="small">
        <ProForm>
          <ProFormText />
        </ProForm>
      </ConfigProvider>,
    );
    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-input-sm').length).toBe(1);
    wrapper.unmount();
  });

  it('π¦ ProForm support sync form url', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          fn(values.navTheme);
        }}
        syncToUrl
      >
        <ProFormText
          tooltip={{
            title: 'δΈ»ι’',
            icon: <FontSizeOutlined />,
          }}
          name="navTheme"
        />
      </ProForm>,
    );

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(fn).toHaveBeenCalledWith('realDark');

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLHtmlElement>('button.ant-btn')[1].click();
    });

    expect(fn).toHaveBeenCalledWith('realDark');
  });

  it('π¦ ProForm support sync form url as important', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          fn(values.navTheme);
        }}
        syncToUrl
        syncToUrlAsImportant
      >
        <ProFormText
          tooltip={{
            title: 'δΈ»ι’',
            icon: <FontSizeOutlined />,
          }}
          name="navTheme"
        />
      </ProForm>,
    );

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });
    expect(fn).toHaveBeenCalledWith('realDark');

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('button.ant-btn')[1].click();
    });

    expect(fn).toHaveBeenCalledWith('realDark');
    wrapper.unmount();
  });

  it('π¦ ProForm support sync form url and rest', async () => {
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          onFinish(values.navTheme);
        }}
        syncToUrl
        syncToInitialValues={false}
      >
        <ProFormText name="navTheme" />
        <ProForm.Item>
          {() => {
            return '123';
          }}
        </ProForm.Item>
      </ProForm>,
    );

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });
    expect(onFinish).toHaveBeenCalledWith('realDark');

    // rest
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('button.ant-btn')[1].click();
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(onFinish).toHaveBeenCalledWith(undefined);
    wrapper.unmount();
  });

  it('π¦ ProForm initialValues update will warning', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          fn(values.navTheme);
        }}
        initialValues={{}}
      >
        <ProFormText name="navTheme" />
      </ProForm>,
    );

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });
    expect(fn).toHaveBeenCalledWith(undefined);

    act(() => {
      wrapper.rerender(
        <ProForm
          onFinish={async (values) => {
            fn(values.navTheme);
          }}
          initialValues={{ navTheme: 'xxx' }}
        >
          <ProFormText name="navTheme" />
        </ProForm>,
      );
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });
    expect(fn).toHaveBeenCalledWith(undefined);
  });

  it('π¦ onFinish should simulate button loading', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async () => {
          fn();
          await waitTime(2000);
        }}
      />,
    );

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });
    const dom = await (await wrapper.findByText('ζ δΊ€')).parentElement;
    expect(dom?.className.includes('ant-btn-loading')).toBe(true);
    expect(fn).toBeCalled();
    wrapper.unmount();
  });

  it('π¦ onFinish should simulate button close loading', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async () => {
          fn();
          await waitTime(1000);
          throw new Error('ζθ΄€');
        }}
      />,
    );

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });
    let dom = await (await wrapper.findByText('ζ δΊ€')).parentElement;
    expect(dom?.className.includes('ant-btn-loading')).toBe(true);
    expect(fn).toBeCalled();
    dom = await (await wrapper.findByText('ζ δΊ€')).parentElement;
    await act(async () => {
      await waitTime(1200);
    });
    expect(dom?.className.includes('ant-btn-loading')).toBe(false);
    wrapper.unmount();
  });

  it('π¦ onFinish support params and request', async () => {
    const wrapper = render(
      <ProForm
        request={async (params) => {
          await act(async () => {});
          return params;
        }}
        params={{
          name: 'test',
        }}
      >
        <ProFormText name="name" />
      </ProForm>,
    );

    expect(!!(await wrapper.findByDisplayValue('test'))).toBeTruthy();

    act(() => {
      wrapper.rerender(
        <ProForm
          key="rerender"
          request={async (params) => {
            await act(async () => {});
            return params;
          }}
          params={{
            name: '1234',
          }}
        >
          <ProFormText name="name" />
        </ProForm>,
      );
    });

    expect(!!(await wrapper.findByDisplayValue('1234'))).toBeTruthy();
    wrapper.unmount();
  });

  it('π¦ submit props actionsRender=()=>false', async () => {
    const wrapper = render(
      <ProForm
        submitter={{
          render: () => false,
        }}
      />,
    );

    expect(wrapper.asFragment()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('π¦ submit props actionsRender is one', async () => {
    const wrapper = render(
      <ProForm
        submitter={{
          render: () => [<a key="test">test</a>],
        }}
      />,
    );

    expect(wrapper.asFragment()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('π¦ support formRef', async () => {
    const formRef = React.createRef<ProFormInstance<any>>();
    const wrapper = render(
      <ProForm
        formRef={formRef}
        submitter={{
          render: () => [<a key="test">test</a>],
        }}
        initialValues={{
          test: '12,34',
        }}
      >
        <ProFormText
          name="test"
          transform={(value) => {
            return {
              test: value.split(','),
            };
          }}
        />
      </ProForm>,
    );
    await waitTime(1000);
    expect(formRef.current?.getFieldFormatValue?.('test')?.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldFormatValueObject?.('test')?.test.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldFormatValueObject?.()?.test.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldsFormatValue?.()?.test.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldFormatValue?.(['test'])?.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldValue?.('test')).toBe('12,34');
    wrapper.unmount();
  });

  it('π¦ ProForm support namePath is array', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm
        initialValues={{
          name: {
            test: 'test',
          },
          test: 'test2',
        }}
        isKeyPressSubmit
        onFinish={async (params) => {
          fn(params);
        }}
      >
        <ProFormText name={['name', 'test']} />
        <ProFormText name="test" />
      </ProForm>,
    );

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(fn).toBeCalledWith({
      name: {
        test: 'test',
      },
      test: 'test2',
    });
    wrapper.unmount();
  });

  it('π¦ ProForm support enter submit', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm
        omitNil={false}
        isKeyPressSubmit
        onFinish={async () => {
          fn();
        }}
      >
        <ProFormText name="test" />
      </ProForm>,
    );

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(fn).toBeCalled();
    wrapper.unmount();
  });

  it('π¦ submit props actionsRender=false', async () => {
    const wrapper = render(
      <ProForm
        submitter={{
          render: false,
        }}
      />,
    );

    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('π¦ submit props actionsRender=()=>[]', async () => {
    const wrapper = render(
      <ProForm
        submitter={{
          render: () => [],
        }}
      />,
    );

    expect(wrapper.asFragment()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('π¦ submit props render=()=>[]', async () => {
    const wrapper = render(
      <ProForm
        submitter={{
          render: () => [
            <Button key="submit" type="primary">
              ζδΊ€εΉΆεεΈ
            </Button>,
          ],
        }}
      />,
    );

    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('π¦ submitter props support submitButtonProps', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm
        submitter={{
          submitButtonProps: {
            className: 'test_button',
            onClick: () => {
              fn();
            },
          },
        }}
      />,
    );

    act(() => {
      expect(wrapper.asFragment()).toMatchSnapshot();
    });

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('button.test_button')[0].click();
    });

    expect(fn).toBeCalled();
    wrapper.unmount();
  });

  it('π¦ submitter props support resetButtonProps', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm
        submitter={{
          resetButtonProps: {
            className: 'test_button',
            onClick: () => {
              fn();
            },
          },
        }}
      />,
    );

    act(() => {
      expect(wrapper.asFragment()).toMatchSnapshot();
    });
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('button.test_button')[0].click();
    });
    expect(fn).toBeCalled();
    wrapper.unmount();
  });

  it('π¦ submitter.render simulate onFinish', async () => {
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={onFinish}
        submitter={{
          render: ({ form }) => [
            <Button
              id="submit"
              key="submit"
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              ζδΊ€εΉΆεεΈ
            </Button>,
          ],
        }}
      >
        <ProFormText label="name" name="name" />
      </ProForm>,
    );

    await act(async () => {
      (await wrapper.findByText('ζδΊ€εΉΆεεΈ')).click();
    });

    await act(async () => {
      await waitTime(100);
    });
    expect(onFinish).toBeCalled();
    wrapper.unmount();
  });

  it('π¦ ProFormCaptcha support onGetCaptcha', async () => {
    const wrapper = render(
      <ProForm>
        <ProFormCaptcha
          onGetCaptcha={async () => {
            await waitTime(10);
          }}
          captchaProps={{
            id: 'test',
          }}
          countDown={2}
          label="name"
          name="name"
        />
      </ProForm>,
    );

    let captcha = await wrapper.findByText('θ·ειͺθ―η ');
    expect(!!captcha).toBeTruthy();

    await act(async () => {
      (await wrapper.findByText('θ·ειͺθ―η '))?.click();
      await waitTime(100);
    });

    expect(wrapper.baseElement.querySelector<HTMLElement>('button#test')?.textContent).toBe(
      '2 η§ειζ°θ·ε',
    );

    await act(async () => {
      await waitTime(1000);
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('button#test')[0].textContent).toBe(
      '1 η§ειζ°θ·ε',
    );

    await act(async () => {
      await waitTime(1000);
    });

    captcha = await wrapper.findByText('θ·ειͺθ―η ');

    expect(!!captcha).toBeTruthy();
    wrapper.unmount();
  });

  it('π¦ ProFormCaptcha support value and onchange', async () => {
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm onFinish={(values) => onFinish(values.name)}>
        <ProFormCaptcha
          onGetCaptcha={async () => {
            await waitTime(10);
          }}
          countDown={2}
          label="name"
          name="name"
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelectorAll<HTMLElement>('input#name')[0], {
        target: {
          value: 'test',
        },
      });
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(onFinish).toBeCalledWith('test');
    wrapper.unmount();
  });

  it('π¦ ProFormCaptcha support captchaTextRender', async () => {
    const wrapper = render(
      <ProForm>
        <ProFormCaptcha
          onGetCaptcha={async () => {
            await waitTime(10);
          }}
          captchaTextRender={(timing) => (timing ? 'ιζ°θ·ε' : 'θ·ε')}
          captchaProps={{
            id: 'test',
          }}
          label="name"
          name="name"
        />
      </ProForm>,
    );

    let captcha = await wrapper.findByText('θ· ε');
    expect(!!captcha).toBeTruthy();

    await act(async () => {
      captcha?.click();
      await waitTime(1000);
    });

    captcha = await wrapper.findByText('ιζ°θ·ε');
    expect(!!captcha).toBeTruthy();
    wrapper.unmount();
  });

  it('π¦ ProFormCaptcha onGetCaptcha throw error', async () => {
    const wrapper = render(
      <ProForm>
        <ProFormCaptcha
          onGetCaptcha={async () => {
            await waitTime(10);
            throw new Error('TEST');
          }}
          captchaTextRender={(timing) => (timing ? 'ιζ°θ·ε' : 'θ·ε')}
          captchaProps={{
            id: 'test',
          }}
          label="name"
          name="name"
        />
      </ProForm>,
    );

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('Button#test')[0].click();
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('button#test')[0].textContent).toBe(
      'θ· ε',
    );
    wrapper.unmount();
  });

  it('π¦ ProFormCaptcha onGetCaptcha support rules', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormText
          name="phone"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormCaptcha
          onGetCaptcha={async () => {
            fn();
            await waitTime(10);
          }}
          phoneName="phone"
          captchaProps={{
            id: 'test',
          }}
          label="name"
          name="name"
        />
      </ProForm>,
    );

    const captcha = await wrapper.findByText('θ·ειͺθ―η ');
    expect(!!captcha).toBeTruthy();

    await act(async () => {
      (await wrapper.findByText('θ·ειͺθ―η '))?.click();
      await waitTime(100);
    });

    expect(fn).not.toBeCalled();

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelectorAll<HTMLElement>('input')[1], {
        target: {
          value: 'tech',
        },
      });
    });

    await act(async () => {
      captcha.click();
      await waitTime(100);
    });

    expect(fn).toBeCalled();
    wrapper.unmount();
  });

  it('π¦ ProFormDependency', async () => {
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={onFinish}
        initialValues={{
          name: 'θθθ?Ύθ?‘ζιε¬εΈ',
          name2: 'θθθ?Ύθ?‘ιε’',
          useMode: 'chapter',
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="η­ΎηΊ¦ε?’ζ·εη§°"
          tooltip="ζιΏδΈΊ 24 δ½"
          placeholder="θ―·θΎε₯εη§°"
        />
        <ProFormText
          width="md"
          name={['name2', 'text']}
          label="η­ΎηΊ¦ε?’ζ·εη§°"
          tooltip="ζιΏδΈΊ 24 δ½"
          placeholder="θ―·θΎε₯εη§°"
        />
        {/*  ProFormDependency δΌθͺε¨ζ³¨ε₯εΉΆδΈ θΏθ‘ shouldUpdate ηζ―ε―Ή  */}
        <ProFormDependency name={['name', ['name2', 'text']]}>
          {(values) => {
            return (
              <ProFormSelect
                options={[
                  {
                    value: 'chapter',
                    label: 'ηη« εηζ',
                  },
                ]}
                width="md"
                name="useMode"
                label={
                  <span id="label_text">{`δΈγ${values?.name || ''}γ δΈ γ${
                    values?.name2?.text || ''
                  }γεεηΊ¦ε?ηζζΉεΌ`}</span>
                }
              />
            );
          }}
        </ProFormDependency>
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelectorAll<HTMLElement>('input#name')[0], {
        target: {
          value: 'test',
        },
      });
    });

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelectorAll<HTMLElement>('input#name2_text')[0], {
        target: {
          value: 'test2',
        },
      });
    });

    expect(wrapper.baseElement.querySelector<HTMLElement>('span#label_text')?.textContent).toBe(
      'δΈγtestγ δΈ γtest2γεεηΊ¦ε?ηζζΉεΌ',
    );
    wrapper.unmount();
  });

  it('π¦ ProForm.Group support collapsible', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProForm.Group title="qixian" collapsible onCollapse={(c) => fn(c)}>
          <ProFormText name="phone" />
          <ProFormText name="phone2" />
        </ProForm.Group>
      </ProForm>,
    );

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-pro-form-group-title')[0].click();
    });

    expect(fn).toBeCalledWith(true);

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-pro-form-group-title')[0].click();
    });

    expect(fn).toBeCalledWith(false);
    wrapper.unmount();
  });

  it('π¦ ProForm.Group support defaultCollapsed', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProForm.Group title="qixian" collapsible defaultCollapsed={true} onCollapse={(c) => fn(c)}>
          <ProFormText name="phone" />
          <ProFormText name="phone2" />
        </ProForm.Group>
      </ProForm>,
    );

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-pro-form-group-title')[0].click();
    });

    expect(fn).toBeCalledWith(false);

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-pro-form-group-title')[0].click();
    });

    expect(fn).toBeCalledWith(true);
    wrapper.unmount();
  });

  it('π¦ ProForm.Group support defaultCollapsed', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProForm.Group
          title="qixian"
          collapsible
          extra={<a id="click">ηΉε»</a>}
          onCollapse={(c) => fn(c)}
        >
          <ProFormText name="phone" />
          <ProFormText name="phone2" />
        </ProForm.Group>
      </ProForm>,
    );

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('#click')[0].click();
    });

    expect(fn).not.toBeCalled();
    wrapper.unmount();
  });
  it('π¦ ProForm.Group support FormItem hidden', async () => {
    const wrapper = render(
      <ProForm>
        <ProForm.Group title="qixian" collapsible>
          <ProFormText name="mobile" hidden />
          <div>mobile</div>
          <ProFormText name="mobile2" />
        </ProForm.Group>
      </ProForm>,
    );

    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        '.ant-pro-form-group-container div.ant-form-item',
      ).length,
    ).toBe(1);
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        '.ant-pro-form-group-container div.ant-space-item',
      ).length,
    ).toBe(2);
    wrapper.unmount();
  });

  it('π¦ ProFormField support onChange', async () => {
    const fn = jest.fn();
    const wrapper = render(
      <ProForm onValuesChange={fn}>
        <ProFormField name="phone2">
          <Input id="testInput" />
        </ProFormField>
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelectorAll<HTMLElement>('input#testInput')[0], {
        target: {
          value: 'test',
        },
      });
    });
    expect(fn).toBeCalled();
    wrapper.unmount();
  });

  it('π¦ DatePicker support dateformat', async () => {
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={onFinish}
        initialValues={{
          date: '2020-09-10',
          dateWeek: '2020-37th',
          dateMonth: '2020-09',
          dateQuarter: '2020-Q2',
        }}
      >
        <ProFormDatePicker name="date" label="ζ₯ζ" fieldProps={{ open: true }} />
        <ProFormDatePicker.Week name="dateWeek" label="ε¨" />
        <ProFormDatePicker.Month name="dateMonth" label="ζ" />
        <ProFormDatePicker.Quarter name="dateQuarter" label="ε­£εΊ¦" />
        <ProFormDatePicker.Year name="dateYear" label="εΉ΄" />
      </ProForm>,
    );
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-picker-cell')[2].click();
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
      await waitTime(100);
    });

    expect(onFinish).toHaveBeenCalledWith({
      date: '2020-09-02',
      dateWeek: '2020-37th',
      dateMonth: '2020-09',
      dateQuarter: '2020-Q2',
    });
    wrapper.unmount();
  });

  it('π¦ SearchSelect onSearch support', async () => {
    const onSearch = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            onSearch: (e) => onSearch(e),
          }}
          options={[
            { label: 'ε¨ι¨', value: 'all' },
            { label: 'ζͺθ§£ε³', value: 'open' },
            { label: 'ε·²θ§£ε³', value: 'closed' },
            { label: 'θ§£ε³δΈ­', value: 'processing' },
          ]}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'ε¨',
        },
      });
    });

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        '.ant-select-item-option-content div span',
      )[0].textContent,
    ).toBe('ε¨');
    wrapper.unmount();
  });

  it('π¦ SearchSelect onSearch support valueEnum', async () => {
    const onSearch = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'ε¨',
        },
      });
    });

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        '.ant-select-item-option-content div span',
      )[0].textContent,
    ).toBe('ε¨');
    wrapper.unmount();
  });

  it('π¦ SearchSelect onSearch support valueEnum clear', async () => {
    const onSearch = jest.fn();
    const onValuesChange = jest.fn();
    const wrapper = render(
      <ProForm
        onValuesChange={async (values) => {
          //  {"disabled": undefined, "key": "all", "label": "ε¨ι¨", "value": "all"}
          onValuesChange(values.userQuery[0].label);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'ε¨',
        },
      });
    });

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        '.ant-select-item-option-content div span',
      )[0].textContent,
    ).toBe('ε¨');

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[0].click();
    });

    expect(onValuesChange).toBeCalledWith('ε¨ι¨');
    wrapper.unmount();
  });

  it('π¦ SearchSelect onSearch support valueEnum clear item filter', async () => {
    const onSearch = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'ε¨',
        },
      });
    });

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        '.ant-select-item-option-content div span',
      )[0].textContent,
    ).toBe('ε¨');

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(1);

    act(() => {
      fireEvent.focus(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-selector')[0]);
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(4);
    wrapper.unmount();
  });

  it('π¦ SearchSelect support onClear', async () => {
    const onSearch = jest.fn();
    const wrapper = render(
      <ProForm onValuesChange={(e) => console.log(e)}>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          showSearch
          fieldProps={{
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'ε¨',
        },
      });
    });

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        '.ant-select-item-option-content div span',
      )[0].textContent,
    ).toBe('ε¨');

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(1);

    act(() => {
      wrapper.baseElement
        .querySelectorAll<HTMLElement>('.ant-select-item-option-content div span')[0]
        .click();
    });

    act(() => {
      fireEvent.mouseEnter(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select')[0]);
    });

    act(() => {
      fireEvent.mouseDown(
        wrapper.baseElement.querySelectorAll('.ant-select-selector')[
          wrapper.baseElement.querySelectorAll<HTMLElement>('span.ant-select-clear').length - 1
        ],
      );
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(4);
    wrapper.unmount();
  });

  it('π¦ SearchSelect support searchOnFocus', async () => {
    const onSearch = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'ε¨',
        },
      });
    });

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        '.ant-select-item-option-content div span',
      )[0].textContent,
    ).toBe('ε¨');

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(1);

    act(() => {
      fireEvent.focus(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-selector')[0]);
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(4);
    wrapper.unmount();
  });

  it('π¦ SearchSelect support resetAfterSelect', async () => {
    const onSearch = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            resetAfterSelect: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'ε¨',
        },
      });
    });

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(1);
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        '.ant-select-item-option-content div span',
      )[0].textContent,
    ).toBe('ε¨');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[0].click();
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(4);
    wrapper.unmount();
  });

  it('π¦ SearchSelect support fetchDataOnSearch: false', async () => {
    const onRequest = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            fetchDataOnSearch: false,
          }}
          request={async () => {
            onRequest();
            return [
              { label: 'ε¨ι¨', value: 'all' },
              { label: 'ζͺθ§£ε³', value: 'open' },
              { label: 'ε·²θ§£ε³', value: 'closed' },
              { label: 'θ§£ε³δΈ­', value: 'processing' },
            ];
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'ε¨',
        },
      });
    });

    expect(onRequest.mock.calls.length).toBe(1);
  });

  it('π¦ SearchSelect support fetchDataOnSearch: true', async () => {
    const onRequest = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            fetchDataOnSearch: true,
          }}
          request={async () => {
            onRequest();
            return [
              { label: 'ε¨ι¨', value: 'all' },
              { label: 'ζͺθ§£ε³', value: 'open' },
              { label: 'ε·²θ§£ε³', value: 'closed' },
              { label: 'θ§£ε³δΈ­', value: 'processing' },
            ];
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'ε¨',
        },
      });
    });

    await act(async () => {
      await waitTime(200);
    });
    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    await act(async () => {
      await waitTime(200);
    });

    expect(onRequest.mock.calls.length).toBe(3);
    wrapper.unmount();
  });

  it('π¦ SearchSelect support multiple', async () => {
    const onSearch = jest.fn();
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery?.length);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            mode: 'multiple',
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[0].click();
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[1].click();
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    // ε€ζ¬‘ζδΊ€ιθ¦ι»ζ­’
    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(onFinish).toBeCalledWith(2);
    wrapper.unmount();
  });

  it('π¦ SearchSelect filter support optionGroup', async () => {
    const onValuesChange = jest.fn();
    const wrapper = render(
      <ProForm
        onValuesChange={async (values) => {
          onValuesChange(values?.userQuery[0].value);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="δΈε‘ηΊΏ"
          rules={[{ required: true }]}
          options={[
            {
              label: 'Aη³»η»',
              value: 'Aη³»η»',
              optionType: 'optGroup',
              children: [
                { label: 'ι¨εΊε°η¨εΊ', value: 'ι¨εΊε°η¨εΊ' },
                { label: 'θ΅ιηΊΏ', value: 'θ΅ιηΊΏ' },
              ],
            },
            {
              label: 'Bη³»η»',
              value: 'Bη³»η»',
              optionType: 'optGroup',
              children: [
                { label: 'Bι¨εΊε°η¨εΊ', value: 'Bι¨εΊε°η¨εΊ' },
                { label: 'Bθ΅ιηΊΏ', value: 'Bθ΅ιηΊΏ' },
              ],
            },
          ]}
          showSearch
          fieldProps={{
            allowClear: false,
            showSearch: true,
          }}
        />
      </ProForm>,
    );

    await act(async () => {
      fireEvent.mouseDown(wrapper.baseElement.querySelector('.ant-select-selector')!);
    });

    await act(async () => {
      const input = await wrapper.findByRole('combobox');
      fireEvent.change(input, {
        target: {
          value: 'ι¨',
        },
      });
      await waitTime(200);
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelector('.ant-select-selector')!);
    });

    // εΊθ―₯ζδΈ€δΈͺ item θ’«η­ιεΊζ₯
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(2);

    act(() => {
      wrapper.baseElement
        .querySelectorAll<HTMLElement>('.ant-select-item.ant-select-item-option')[0]
        .click();
    });

    expect(onValuesChange).toBeCalledWith('ι¨εΊε°η¨εΊ');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelector('.ant-select-selector')!);
    });

    await act(async () => {
      const input = await wrapper.findByRole('combobox');
      fireEvent.change(input, {
        target: {
          value: 'ζθ΄€',
        },
      });
      await waitTime(200);
    });
    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelector('.ant-select-selector')!);
    });

    // εΊθ―₯ζ²‘ζη­ι
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(0);

    wrapper.unmount();
  });

  it('π¦ SearchSelect filter support (', async () => {
    const onValuesChange = jest.fn();
    const wrapper = render(
      <ProForm
        onValuesChange={async (values) => {
          onValuesChange(values?.userQuery[0].value);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="δΈε‘ηΊΏ"
          rules={[{ required: true }]}
          options={[
            {
              label: 'Aη³»η»',
              value: 'Aη³»η»',
              optionType: 'optGroup',
              children: [
                { label: 'ι¨εΊε°η¨εΊ(ζ΅θ―)', value: 'ι¨εΊε°η¨εΊ' },
                { label: 'θ΅ιηΊΏ', value: 'θ΅ιηΊΏ' },
              ],
            },
            {
              label: 'Bη³»η»',
              value: 'Bη³»η»',
              optionType: 'optGroup',
              children: [
                { label: 'Bι¨εΊε°η¨εΊ', value: 'Bι¨εΊε°η¨εΊ' },
                { label: 'Bθ΅ιηΊΏ', value: 'Bθ΅ιηΊΏ' },
              ],
            },
          ]}
          showSearch
          fieldProps={{
            allowClear: false,
            showSearch: true,
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    await act(async () => {
      const input = await wrapper.findByRole('combobox');
      fireEvent.change(input, {
        target: {
          value: '(ζ΅θ―)',
        },
      });
      await waitTime(200);
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // εΊθ―₯ζδΈ€δΈͺ item θ’«η­ιεΊζ₯
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(1);

    act(() => {
      wrapper.baseElement
        .querySelectorAll<HTMLElement>('.ant-select-item.ant-select-item-option')[0]
        .click();
    });

    expect(onValuesChange).toBeCalledWith('ι¨εΊε°η¨εΊ');

    wrapper.unmount();
  });

  it('π¦ SearchSelect support multiple and autoClearSearchValue: false ', async () => {
    const onSearch = jest.fn();
    const onFinish = jest.fn();

    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery?.length);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="δΊ§ειζ©"
          placeholder="ζ΅θ― placeholder"
          fieldProps={{
            mode: 'multiple',
            autoClearSearchValue: false,
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          options={[
            { label: 'ε¨ι¨', value: 'all' },
            { label: 'ζͺθ§£ε³', value: 'open' },
            { label: 'ε·²θ§£ε³', value: 'closed' },
            { label: 'θ§£ε³δΈ­', value: 'processing' },
          ]}
        />
      </ProForm>,
    );

    // ηΉε»ζη΄’ζ‘
    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ι»θ?€ε±η€Ίζζη7δΈͺιι‘Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(4);
    // ι»θ?€θΎε₯ζ‘ζ²‘ζεε?Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item-option-content div span')
        .length,
    ).toBe(0);
    // input εη΄ ηεε?ΉδΉδΈΊη©Ί
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('');

    // θΎε₯ζη΄’εε?Ή
    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'θ§£',
        },
      });
    });

    // εΊθ―₯ζ4δΈͺitem θ’«η­ιεΊζ₯
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(3);
    // input δΉζθΎε₯ηεε?Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('θ§£');

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[0].click();
    });

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item-option-content')[0]
        .textContent,
    ).toBe('ζͺθ§£ε³');
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('θ§£');
    // ζη΄’ηη»ζ, εΊθ―₯δΏζδΈε
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(3);

    // η»§η»­ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[1].click();
    });

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item-option-content')[1]
        .textContent,
    ).toBe('ε·²θ§£ε³');
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('θ§£');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    // ε€ζ¬‘ζδΊ€ιθ¦ι»ζ­’
    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(onFinish).toBeCalledWith(2);
    wrapper.unmount();
  });

  it('π¦ Select support single', async () => {
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery);
        }}
      >
        <ProFormSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[0].click();
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[1].click();
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(onFinish).toBeCalledWith('open');
  });

  it('π¦ ProFormSelect support filterOption', async () => {
    const onSearch = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormSelect
          fieldProps={{
            filterOption: false,
            onSearch: (e) => onSearch(e),
          }}
          options={[
            { value: 1, label: 'Aa' },
            { value: 2, label: 'Bb' },
            { value: 3, label: 'Cc' },
          ]}
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'A',
        },
      });
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(3);
  });

  it('π¦ Select filterOption support mixed case', async () => {
    const wrapper = render(
      <ProForm>
        <ProFormSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            showSearch: true,
            options: [
              { value: 1, label: 'Aa' },
              { value: 2, label: 'Bb' },
              { value: 3, label: 'Cc' },
            ],
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'b',
        },
      });
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(1);

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: 'B',
        },
      });
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    expect(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item').length).toBe(1);
  });

  it('π¦ Select support labelInValue single', async () => {
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery.value);
        }}
      >
        <ProFormSelect
          fieldProps={{
            labelInValue: true,
          }}
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[0].click();
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[1].click();
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(onFinish).toBeCalledWith('open');
  });

  it('π¦ Select support multiple unnamed async options', async () => {
    const wrapper = render(
      <>
        <ProFormSelect id="select1" request={async () => [{ value: 1 }]} />
        <ProFormSelect id="select2" request={async () => [{ value: 2 }]} />
      </>,
    );

    await act(async () => {
      await waitTime(100);
    });

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0]);
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[1]);
    });

    const textList = wrapper.baseElement.querySelectorAll<HTMLElement>(
      '.ant-select-item-option-content',
    );
    // ε θ½½ options
    expect(textList.length).toBe(2);
    expect(textList[0].textContent).toBe('1');
    expect(textList[1].textContent).toBe('2');
  });

  it('π¦ Select support multiple and autoClearSearchValue: false ', async () => {
    const onSearch = jest.fn();
    const onFinish = jest.fn();

    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery?.length);
        }}
      >
        <ProFormSelect
          name="userQuery"
          label="δΊ§ειζ©"
          placeholder="ζ΅θ― placeholder"
          fieldProps={{
            mode: 'multiple',
            autoClearSearchValue: false,
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          options={[
            {
              value: '2',
              label: 'η½ηΉ2',
            },
            {
              value: '21',
              label: 'η½ηΉ21',
            },
            {
              value: '22',
              label: 'η½ηΉ22',
            },
            {
              value: '3',
              label: 'η½ηΉ3',
            },
            {
              value: '31',
              label: 'η½ηΉ31',
            },
            {
              value: '32',
              label: 'η½ηΉ32',
            },
            {
              value: '33',
              label: 'η½ηΉ33',
            },
          ]}
        />
      </ProForm>,
    );

    // ηΉε»ζη΄’ζ‘
    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ι»θ?€ε±η€Ίζζη7δΈͺιι‘Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(7);
    // ι»θ?€θΎε₯ζ‘ζ²‘ζεε?Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item-option-content div span')
        .length,
    ).toBe(0);
    // input εη΄ ηεε?ΉδΉδΈΊη©Ί
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('');

    // θΎε₯ζη΄’εε?Ή
    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: '2',
        },
      });
    });

    // εΊθ―₯ζ4δΈͺitem θ’«η­ιεΊζ₯
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(4);
    // input δΉζθΎε₯ηεε?Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('2');

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[0].click();
    });

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item-option-content')[0]
        .textContent,
    ).toBe('η½ηΉ2');
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('2');
    // ζη΄’ηη»ζ, εΊθ―₯δΏζδΈε
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(4);

    // η»§η»­ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[1].click();
    });

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item-option-content')[1]
        .textContent,
    ).toBe('η½ηΉ21');
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('2');

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    // ε€ζ¬‘ζδΊ€ιθ¦ι»ζ­’
    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(onFinish).toBeCalledWith(2);
  });

  it('π¦ Select support multiple and autoClearSearchValue: true', async () => {
    const onSearch = jest.fn();
    const onFinish = jest.fn();

    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery?.length);
        }}
      >
        <ProFormSelect
          name="userQuery"
          label="δΊ§ειζ©"
          placeholder="ζ΅θ― placeholder"
          fieldProps={{
            mode: 'multiple',
            autoClearSearchValue: true,
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          options={[
            {
              value: '2',
              label: 'η½ηΉ2',
            },
            {
              value: '21',
              label: 'η½ηΉ21',
            },
            {
              value: '22',
              label: 'η½ηΉ22',
            },
            {
              value: '3',
              label: 'η½ηΉ3',
            },
            {
              value: '31',
              label: 'η½ηΉ31',
            },
            {
              value: '32',
              label: 'η½ηΉ32',
            },
            {
              value: '33',
              label: 'η½ηΉ33',
            },
          ]}
        />
      </ProForm>,
    );

    // ηΉε»ζη΄’ζ‘
    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ι»θ?€ε±η€Ίζζη7δΈͺιι‘Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(7);
    // ι»θ?€θΎε₯ζ‘ζ²‘ζεε?Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item-option-content div span')
        .length,
    ).toBe(0);
    // input εη΄ ηεε?ΉδΉδΈΊη©Ί
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('');

    // θΎε₯ζη΄’εε?Ή
    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-select-selection-search-input')!, {
        target: {
          value: '2',
        },
      });
    });

    // εΊθ―₯ζ4δΈͺitem θ’«η­ιεΊζ₯
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(4);
    // input δΉζθΎε₯ηεε?Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('2');

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[0].click();
    });

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item-option-content')[0]
        .textContent,
    ).toBe('η½ηΉ2');
    // ιδΈ­εοΌ δΌθͺε¨ζΈη©Ίζη΄’εε?Ή
    expect(
      wrapper.baseElement.querySelectorAll<HTMLInputElement>(
        'input.ant-select-selection-search-input',
      )[0].value,
    ).toBe('');
    // ζη΄’ηη»ζ, ζ’ε€ε°εε§η»ζ
    expect(
      wrapper.baseElement.querySelectorAll<HTMLElement>(
        'div.ant-select-item.ant-select-item-option',
      ).length,
    ).toBe(7);

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    // ε€ζ¬‘ζδΊ€ιθ¦ι»ζ­’
    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(onFinish).toBeCalledWith(1);
  });

  it('π¦ ColorPicker support rgba', async () => {
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm
        onValuesChange={async (values) => {
          onFinish(values?.color);
        }}
      >
        <ProFormColorPicker name="color" label="ι’θ²ιζ©" />
      </ProForm>,
    );

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-pro-field-color-picker')[0].click();
    });

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.baseElement
        .querySelectorAll<HTMLElement>('.flexbox-fix')[2]
        .querySelectorAll<HTMLDivElement>('div span div')[2]
        .click();
    });

    expect(onFinish).toBeCalledWith('#5b8ff9');

    act(() => {
      fireEvent.change(
        wrapper.baseElement.querySelectorAll<HTMLElement>('#rc-editable-input-5')[0],
        {
          target: {
            value: 2,
          },
        },
      );
    });

    expect(onFinish).toBeCalledWith('rgba(91, 143, 249, 0.02)');
  });

  it('π¦ validateFieldsReturnFormatValue', async () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const App = () => {
      const formRef = useRef<
        ProFormInstance<{
          date: string;
        }>
      >();

      useEffect(() => {
        formRef.current?.validateFieldsReturnFormatValue?.().then((val) => {
          fn1(val.date);
        });
      }, []);

      return (
        <ProForm
          onValuesChange={async () => {
            formRef.current?.validateFieldsReturnFormatValue?.().then((val) => {
              fn2(val.date);
            });
          }}
          formRef={formRef}
        >
          <ProFormDatePicker
            name="date"
            initialValue={moment('2021-08-09')}
            fieldProps={{ open: true }}
          />
        </ProForm>
      );
    };

    const wrapper = render(<App />);

    await act(async () => {
      await waitTime(200);
    });
    expect(fn1).toHaveBeenCalledWith('2021-08-09');

    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-picker-cell')[2].click();
    });
    await act(async () => {
      await waitTime(200);
    });
    expect(fn2).toHaveBeenCalledWith('2021-07-28');

    expect(wrapper.asFragment()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('π¦ DigitRange Will return undefined when both value equal to undefined', async () => {
    const onFinish = jest.fn();
    const wrapper = render(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.digitRange);
        }}
      >
        <ProFormDigitRange name="digitRange" />
      </ProForm>,
    );

    // ζ΅θ―εΊζ¬εθ½
    act(() => {
      fireEvent.change(wrapper.baseElement.querySelector('.ant-input-number-input')!, {
        target: {
          value: '1',
        },
      });
    });

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelectorAll('.ant-input-number-input')[1], {
        target: {
          value: '2',
        },
      });
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });
    expect(onFinish).toBeCalledWith([1, 2]);

    // ζ΅θ―ζΈη©ΊδΈ€δΈͺεΌ
    act(() => {
      fireEvent.change(wrapper.baseElement.querySelectorAll('.ant-input-number-input')[0], {
        target: {
          value: '',
        },
      });
    });

    act(() => {
      fireEvent.change(wrapper.baseElement.querySelectorAll('.ant-input-number-input')[1], {
        target: {
          value: '',
        },
      });
    });

    act(() => {
      fireEvent.blur(
        wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-input-number-input')[1],
      );
    });

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(onFinish).toBeCalledWith(undefined);
  });

  it('π¦ when dateFormatter is a Function', async () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const App = () => {
      return (
        <ProForm
          dateFormatter={(value, valueType) => {
            fn1(value.format('YYYY/MM/DD HH:mm:ss'), valueType);
            return value.format('YYYY/MM/DD HH:mm:ss');
          }}
          onFinish={async (values) => {
            fn2(values.datetime);
            return true;
          }}
        >
          <ProFormDateTimePicker
            name="datetime"
            initialValue={moment('2021-08-09 12:12:12')}
            fieldProps={{ open: true }}
          />
        </ProForm>
      );
    };

    const wrapper = render(<App />);

    expect(fn1).toBeCalledWith('2021/08/09 12:12:12', 'dateTime');

    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });

    expect(fn2).toHaveBeenCalledWith('2021/08/09 12:12:12');

    act(() => {
      expect(wrapper.asFragment()).toMatchSnapshot();
    });
  });

  it(`π¦ rules change should rerender`, () => {
    const html = render(
      <ProForm>
        <ProFormText
          width="md"
          rules={[
            {
              required: true,
              message: 'test',
            },
          ]}
          name="function"
          label="ηζζΉεΌ"
        />
      </ProForm>,
    );

    expect(html.baseElement.querySelectorAll('.ant-form-item-required').length).toBe(1);

    html.rerender(
      <ProForm>
        <ProFormText
          width="md"
          rules={[
            {
              required: false,
              message: 'test',
            },
          ]}
          name="function"
          label="ηζζΉεΌ"
        />
      </ProForm>,
    );

    expect(html.baseElement.querySelectorAll('.ant-form-item-required').length).toBe(0);
    html.unmount();
  });

  it('π¦ fix onChange will get empty object when you set labelInValue ture in ProForm', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <ProForm>
        <ProFormSelect
          fieldProps={{
            labelInValue: true,
            onChange(value) {
              onChange(value);
            },
          }}
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );

    act(() => {
      fireEvent.mouseDown(wrapper.baseElement.querySelectorAll('.ant-select-selector')[0], {});
    });

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select-item')[0].click();
    });

    // ιΌ ζ η§»ε₯ιδΈ­εΊε
    act(() => {
      fireEvent.mouseEnter(wrapper.baseElement.querySelectorAll<HTMLElement>('.ant-select')[0]);
    });

    // ηΉε»ε ι€ζι?θΏθ‘ε ι€ζδ½
    act(() => {
      fireEvent.mouseDown(
        wrapper.baseElement.querySelectorAll<HTMLElement>('span.ant-select-clear')[
          wrapper.baseElement.querySelectorAll<HTMLElement>('span.ant-select-clear').length - 1
        ],
      );
    });

    expect(onChange).toBeCalledWith(undefined);
    wrapper.unmount();
  });

  it(`π¦ valueType digit with precision value`, async () => {
    const fn = jest.fn();
    const html = mount(
      <ProForm
        onFinish={async (value) => {
          fn(value.count);
        }}
      >
        <ProFormDigit
          name="count"
          label="δΊΊζ°"
          fieldProps={{
            precision: 0,
          }}
        />
      </ProForm>,
    );

    await waitForComponentToPaint(html, 300);
    act(() => {
      html.find('input#count').simulate('change', {
        target: {
          value: '22.22',
        },
      });
      html.find('input#count').simulate('blur');
      html.find('button.ant-btn-primary').simulate('click');
      html.update();
    });
    await waitForComponentToPaint(html, 300);
    expect(html.find('input#count').props().value).toBe('22');
    expect(fn).toBeCalledWith(22);
    expect(html.render()).toMatchSnapshot();
  });
});
