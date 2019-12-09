import React, { Component } from 'react';
import '../../assets/styles/components/_like-button.scss';

class LikeButton extends Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      likedState: false,
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  toggleClass() {
    this.setState({
      likedState: !this.state.likedState,
    });
  }

  handleKeyPress(e) {
    e.key === 'Enter' && this.toggleClass();
  }
  render() {
    const iconClass = this.state.likedState
      ? 'ic_favorite'
      : 'ic_favorite_border';
    const buttonClass = !this.state.likedState ? '' : 'liked';
    const buttonText = !this.state.likedState
      ? 'Lisää suosikkeihin'
      : 'Lisätty suosikkeihin';
    return (
      <div
        role="button"
        aria-label={buttonText}
        aria-live="assertive"
        className={`like-button ${buttonClass}`}
        onClick={this.toggleClass}
        onKeyPress={this.handleKeyPress}
        tabIndex="0"
      >
        <i aria-label={buttonText} className={'icon-' + iconClass}></i>
        <span>{buttonText}</span>
      </div>
    );
  }
}

export default LikeButton;
