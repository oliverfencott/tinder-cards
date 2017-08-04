import React, { Component } from 'react';

import Card from './Card';
import './CardStack.css';

class CardStackContainer extends Component {
  render() {
    const { uncheckedUsers } = this.props;

    return (
      <div className="card-stack-container">
        {uncheckedUsers.toArray().map((user, index) => {
          return (
            <div
              key={user.id}
              style={{
                position: 'absolute',
                zIndex: uncheckedUsers.size - index
              }}>
              <Card
                onUpdateCardPosition={this.props.onUpdateCardPosition}
                {...user}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default CardStackContainer;
