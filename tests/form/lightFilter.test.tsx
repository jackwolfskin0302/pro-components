import { mount } from 'enzyme';
import React from 'react';
import { LightFilter, ProFormText, ProFormDatePicker } from '@ant-design/pro-form';
import { waitTime } from '../util';

describe('LightFilter', () => {
  it('basic use', async () => {
    const onValuesChange = jest.fn();
    const onFinish = jest.fn();
    const wrapper = mount(
      <LightFilter
        initialValues={{
          name1: 'yutingzhao1991',
          name3: '2020-08-19',
        }}
        onFinish={onFinish}
        onValuesChange={(_, values) => onValuesChange(values)}
      >
        <ProFormText name="name1" label="名称" />
        <ProFormText name="name2" label="地址" secondary />
        <ProFormDatePicker name="name3" label="日期" />
      </LightFilter>,
    );
    expect(wrapper.find('div.ant-col.ant-form-item-control').length).toEqual(2);
    expect(wrapper.find('.ant-pro-core-field-label').at(0).text()).toEqual('名称: yutingzhao1991');
    expect(wrapper.find('.ant-pro-core-field-label').at(1).text()).toEqual('日期: 2020-08-19');

    // click open more drowdown
    wrapper.find('.ant-pro-core-field-dropdown-label').at(1).simulate('click');
    expect(wrapper.find('div.ant-col.ant-form-item-control').length).toEqual(3);

    // change input in drowdown
    wrapper.find('.ant-input').simulate('change', {
      target: {
        value: 'new value',
        name3: '2020-08-19',
      },
    });
    wrapper.find('.ant-btn.ant-btn-primary').simulate('click');
    expect(onValuesChange).toHaveBeenCalledWith({
      name1: 'yutingzhao1991',
      name2: 'new value',
      name3: '2020-08-19',
    });
    await waitTime();
    expect(onFinish).toHaveBeenCalledWith({
      name1: 'yutingzhao1991',
      name2: 'new value',
      name3: '2020-08-19',
    });

    // clear input
    wrapper.find('.ant-pro-core-field-label .anticon-close').at(0).simulate('click');
    expect(onValuesChange).toHaveBeenCalledWith({
      name2: 'new value',
      name3: '2020-08-19',
    });
    await waitTime();
    expect(onFinish).toHaveBeenCalledWith({
      name2: 'new value',
      name3: '2020-08-19',
    });
    expect(wrapper.find('div.ant-col.ant-form-item-control').length).toEqual(3);

    // change outside input
    wrapper.find('.ant-pro-core-field-label').at(0).simulate('click');
    wrapper.find('.ant-input').simulate('change', {
      target: {
        value: 'name1 update',
      },
    });
    wrapper.find('.ant-btn.ant-btn-primary').simulate('click');
    expect(onValuesChange).toHaveBeenCalledWith({
      name1: 'name1 update',
      name2: 'new value',
      name3: '2020-08-19',
    });

    // DatePicker click
    wrapper.find('.ant-pro-core-field-label').at(2).simulate('click');
    wrapper.find('.ant-picker-cell-in-view').at(0).simulate('click');
    await waitTime();
    expect(onFinish).toHaveBeenCalledWith({
      name1: 'name1 update',
      name2: 'new value',
      name3: '2020-08-01',
    });
  });
});
