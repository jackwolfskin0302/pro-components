﻿import React from 'react';
import ProForm, { ProFormFieldSet, ProFormText, ProFormRate } from '@ant-design/pro-form';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { waitForComponentToPaint } from '../util';

describe('ProFormFieldSet', () => {
  it('ProFormFieldSet onChange', async () => {
    const fn = jest.fn();
    const valueFn = jest.fn();
    const html = mount(
      <ProForm
        onFinish={(values) => fn(values.list)}
        onValuesChange={(value) => valueFn(value.list)}
      >
        <ProFormFieldSet name="list">
          <ProFormText
            fieldProps={{
              id: 'filedSet1',
            }}
            key="filedSet1"
          />
          <ProFormRate key="filedSet2" />
        </ProFormFieldSet>
      </ProForm>,
    );

    act(() => {
      html.find('input#filedSet1').simulate('change', {
        target: {
          value: '111',
        },
      });
    });
    expect(valueFn).toBeCalledWith(['111']);

    act(() => {
      html.find('li > div').at(1).simulate('click');
    });
    expect(valueFn).toBeCalledWith(['111', 2]);

    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(html, 200);

    expect(fn).toBeCalledWith(['111', 2]);
  });

  it('ProFormFieldSet transform', async () => {
    const fn = jest.fn();
    const valueFn = jest.fn();
    const html = mount(
      <ProForm
        onFinish={(values) => fn(values.listKey)}
        onValuesChange={(value) => {
          valueFn(value.list);
        }}
      >
        <ProFormFieldSet
          name="list"
          transform={(value) => {
            return {
              list: [...value],
              listKey: value[0],
            };
          }}
        >
          <ProFormText
            fieldProps={{
              id: 'filedSet1',
            }}
            key="filedSet1"
          />
          <ProFormText
            fieldProps={{
              id: 'filedSet2',
            }}
            key="filedSet2"
          />
        </ProFormFieldSet>
      </ProForm>,
    );

    act(() => {
      html.find('input#filedSet1').simulate('change', {
        target: {
          value: '111',
        },
      });
    });
    expect(valueFn).toBeCalledWith(['111']);

    act(() => {
      html.find('input#filedSet2').simulate('change', {
        target: {
          value: '222',
        },
      });
    });
    expect(valueFn).toBeCalledWith(['111', '222']);

    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(html, 200);

    expect(fn).toBeCalledWith('111');
  });
});
