import React from 'react';

export default class Message extends React.Component {
  render() {
    return (<div style={{background: "red"}}>
      {this.props.text}
    </div>);
  }
}
