import React from 'react';

export default class Message extends React.Component {
  render() {
    var classVal = this.props.isBot ? "message__from-penni" : "message__from-user";
    var spaceVal = this.props.isBot ? "space__from-penni" : "space__from-user";
    return (
      <div className="message">
      <div className="space"></div>
        <div className={classVal} >
          {this.props.text}
        </div>

      </div>
    );
  }
}
