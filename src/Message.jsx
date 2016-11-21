import React from 'react';

export default class Message extends React.Component {
  render() {
    const style = {};
    style.background = this.props.isBot ? "green" : "red";
    return (<div style={style}>
      {this.props.text}
    </div>);
  }
}
