import React, { Component } from 'react';

class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e) {
    e.key === 'Enter' &&
      this.setState({
        checked: !this.state.checked,
      });
  }

  render() {
    return (
      <div className="checkbox" onKeyPress={this.handleKeyPress} tabIndex="0">
        <input
          id={this.props.filterName}
          type="checkbox"
          checked={this.state.checked}
        />
        <label htmlFor={this.props.filterName}>{this.props.filterName}</label>
      </div>
    );
  }
}

export default CheckBox;
