import React from 'react';

export default class Admin extends React.Component {
  render() {
    const requests = this.props.requests.map((req) => {
      return (<div key={req.message}>
        {req.intents[0].intent}<br/>
        {req.entities[0].entity}<br/>
        {req.message}<br/>
      </div>);
    });
    return <div>{requests}</div>;
  }
}
