﻿import React from 'react';
import ProForm, { ProFormList, ProFormText, ProFormDependency } from '@ant-design/pro-form';

const Demo = () => {
  return (
    <ProForm>
      <ProFormList
        name={['default', 'users']}
        label="用户信息"
        initialValue={[
          {
            name: '1111',
          },
        ]}
        itemContainerRender={(doms) => {
          return <ProForm.Group>{doms}</ProForm.Group>;
        }}
      >
        {(f, index, action) => {
          console.log(f, index, action);
          return (
            <>
              <ProFormText initialValue={index} name="rowKey" label={`第 ${index} 配置`} />
              <ProFormText name="name" key="name" label="姓名" />
              <ProFormDependency key="remark" name={['name']}>
                {({ name }) => {
                  if (!name) {
                    return (
                      <span
                        style={{
                          lineHeight: '32px',
                        }}
                      >
                        输入姓名展示
                      </span>
                    );
                  }
                  return <ProFormText name="remark" label="昵称详情" />;
                }}
              </ProFormDependency>
            </>
          );
        }}
      </ProFormList>
    </ProForm>
  );
};

export default Demo;
