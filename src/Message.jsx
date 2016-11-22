import React from 'react';

export default class Message extends React.Component {
  render() {
    var classVal = this.props.isBot ? "message__from-penni" : "message__from-user";
    return (
      <div className="message">
        <div className={classVal} >
          {this.props.text}
        </div>
      </div>

    );
  }
}
