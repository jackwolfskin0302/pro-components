/**
 * title: ้้กนๅ่กจ
 */

import { CheckCard } from '@ant-design/pro-components';

export default () => (
  <div style={{ padding: 24, backgroundColor: '#F0F2F5' }}>
    <CheckCard.Group size="small" options={['๐ Apple', '๐ Pear', '๐ Orange']} />
    <br />
    <CheckCard.Group size="small" loading options={['๐ Apple', '๐ Pear', '๐ Orange']} /> <br />
    <CheckCard.Group defaultValue="A">
      <CheckCard title="๐ Orange" value="๐ Orange" />
      <CheckCard title="๐ Pear" value="๐ Pear" />
      <CheckCard title="๐ Apple" value="๐ Apple" />
    </CheckCard.Group>
    <br />
    <CheckCard.Group defaultValue="A" loading>
      <CheckCard title="๐ Orange" value="๐ Orange" />
      <CheckCard title="๐ Pear" value="๐ Pear" />
      <CheckCard title="๐ Apple" value="๐ Apple" />
    </CheckCard.Group>
  </div>
);
