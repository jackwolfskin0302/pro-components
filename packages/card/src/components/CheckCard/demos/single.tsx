/** Uuid: 900875c6 title: 单选模式 */

import React from 'react';
import { CheckCard } from '@ant-design/pro-card';

export default () => (
  <CheckCard.Group
    onChange={(value) => {
      console.log('value', value);
    }}
    defaultValue="A"
  >
    <CheckCard title="Card A" description="选项一" value="A" />
    <CheckCard title="Card B" description="选项二" value="B" />
    <CheckCard title="Card C" disabled description="选项三，这是一个不可选项" value="C" />
  </CheckCard.Group>
);
