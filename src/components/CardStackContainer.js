import React, { Component } from 'react';
import Card from './Card';

import './CardStack.css';

const URL = 'http://localhost:3000/api/potential-matches';

class CardStackContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };

    this._handleFetchDataSuccess = this._handleFetchDataSuccess.bind(this);
  }

  _handleFetchDataSuccess(users) {
    this.setState({
      users
    });
  }

  componentDidMount() {
    fetch(URL)
    .then(res => {
      return res.json();
    })
    .then(data => this._handleFetchDataSuccess(data))
    .catch(error => console.log(error));
  }

  render() {
    const { users } = this.state;

    return (
      <div className="card-stack-container">
        {users.map((user, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              zIndex: users.length - index
            }}>
            <Card {...user} />
          </div>
        )
      )}
      </div>
    );
  }
}

export default CardStackContainer;
