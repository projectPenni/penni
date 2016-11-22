import React from 'react';

export default class Message extends React.Component {
  render() {
    var cname = this.props.isBot ? "message__from-penni" : "message__from-user";
    return (
      <div className={"message" + ' ' + cname}>
        {this.props.text}
      </div>
    );
  }
}
