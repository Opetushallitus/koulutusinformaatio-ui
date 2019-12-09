import React, { Component } from 'react';
import '../../assets/styles/components/_notification-box.scss';

/* <NotificationBox messageType="ok" messageContent="Good work! Looks like everything is setup and ready to go! Let’s roll!"/>
<NotificationBox messageType="info" messageContent="Need help? Let’s chat, talk or… just send us email with your issues."/>
<NotificationBox messageType="error" messageContent="Houston! We have a problem! Our users are so amazing that we can’t handle this!"/>
<NotificationBox messageType="warning" messageContent="Damn! Something goes wrong, but we don’t know what exactly!"/> */

class NotificationBox extends Component {
  render() {
    return (
      <div className="row">
        <div className={`col-12 notification ${this.props.messageType}`}>
          <span></span>
          <p>{this.props.messageContent}</p>
        </div>
      </div>
    );
  }
}

export default NotificationBox;
