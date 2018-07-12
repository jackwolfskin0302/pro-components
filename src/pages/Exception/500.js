import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'dva/router';
import Exception from 'components/Exception';

class Exception500 extends Component {
  render() {
    const { intl } = this.props;
    return (
      <Exception
        type="500"
        desc={intl.formatMessage({ id: 'app.exception.description.500' }, {})}
        style={{ minHeight: 500, height: '80%' }}
        linkElement={Link}
      />
    );
  }
}
export default injectIntl(Exception500);
