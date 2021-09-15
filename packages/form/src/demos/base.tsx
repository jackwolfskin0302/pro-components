import React from 'react';
import { message } from 'antd';
import ProForm, {
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormMoney,
  ProFormDigit,
} from '@ant-design/pro-form';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  return (
    <ProForm<{
      name: string;
      company?: string;
      useMode?: string;
    }>
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values);
        message.success('提交成功');
      }}
      params={{}}
      request={async () => {
        await waitTime(100);
        return {
          name: '蚂蚁设计有限公司',
          useMode: 'chapter',
        };
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          required
          addonBefore={<a>客户名称应该怎么获得？</a>}
          addonAfter={<a>点击查看更多</a>}
          label="签约客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormText width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit name="count" label="人数" width="lg" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormMoney
          label="宽度"
          name="amount0"
          locale="en-US"
          initialValue={22.22}
          min={0}
          width="lg"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormMoney
          label="限制金额最小为0"
          name="amount1"
          locale="en-US"
          initialValue={22.22}
          min={0}
        />
        <ProFormMoney label="不限制金额大小" name="amount2" locale="en-GB" initialValue={22.22} />
        <ProFormMoney label="货币符号跟随全局国际化" name="amount3" initialValue={22.22} />
        <ProFormMoney
          label="自定义货币符号"
          name="amount4"
          initialValue={22.22}
          customSymbol="💰"
        />
        <ProFormText
          name={['contract', 'name']}
          width="md"
          label="合同名称"
          placeholder="请输入名称"
        />
        <ProFormDateRangePicker width="md" name={['contract', 'createTime']} label="合同生效时间" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={[
            {
              value: 'chapter',
              label: '盖章后生效',
            },
          ]}
          readonly
          width="xs"
          name="useMode"
          label="合同约定生效方式"
        />
        <ProFormSelect
          width="xs"
          options={[
            {
              value: 'time',
              label: '履行完终止',
            },
          ]}
          name="unusedMode"
          label="合同约定失效方式"
        />
      </ProForm.Group>
      <ProFormText width="sm" name="id" label="主合同编号" />
      <ProFormText name="project" width="md" disabled label="项目名称" initialValue="xxxx项目" />
      <ProFormText width="xs" name="mangerName" disabled label="商务经理" initialValue="启途" />
    </ProForm>
  );
};
