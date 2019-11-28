import React, { Component } from 'react';
import { observer } from 'mobx-react';
import HakutulosToggle from './HakutulosToggle';

@observer
class HakutulosToggleWrapper extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  render() {
    return <HakutulosToggle />;
  }
}

export default HakutulosToggleWrapper;
