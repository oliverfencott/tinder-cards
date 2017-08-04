import React, { Component } from 'react';
import { Map } from 'immutable';

import CardStackContainer from './components/CardStackContainer';
import ItsAMatchOverlay from './components/ItsAMatchOverlay';
import './App.css';

const URL = 'http://localhost:3000/api/potential-matches';

const DEFAULT_USER_PROPS = {
  dragging: false,
  translateX: 0,
  translateY: 0,
  percentage: 0
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uncheckedUsers: Map(),
      checkedUsers: Map()
    };

    this._handleFetchDataSuccess = this._handleFetchDataSuccess.bind(this);
    this._handleUpdateCardPosition = this._handleUpdateCardPosition.bind(this);
    this._removeUserFromStack = this._removeUserFromStack.bind(this);
  }

  _handleUpdateCardPosition(id, options) {
    const { percentage } = options;
    const { uncheckedUsers } = this.state;
    const user = uncheckedUsers.get(id);

    if (percentage >= 75 || percentage < -75) {
      const [ nextPercentage, liked ] = (
        percentage >= 75
        ? [ 200, true ]
        : [ -200, false ]
      );

      this.setState({
        uncheckedUsers: uncheckedUsers.set(id, {
          ...user,
          dragging: false,
          percentage: nextPercentage,
          liked
        })
      }, () => setTimeout(this._removeUserFromStack.bind(this, id), 250));
    } else {
      this.setState({
        uncheckedUsers: uncheckedUsers.set(id, { ...user, ...options })
      });
    }
  }

  _removeUserFromStack(id) {
    const { uncheckedUsers, checkedUsers } = this.state;

    this.setState({
      uncheckedUsers: uncheckedUsers.delete(id),
      checkedUsers: checkedUsers.set(id, uncheckedUsers.get(id))
    });
  }

  _handleFetchDataSuccess(userData) {
    let { uncheckedUsers } = this.state;

    userData.forEach(user => {
      uncheckedUsers = uncheckedUsers.set(user.id, { ...user, ...DEFAULT_USER_PROPS });
    });

    this.setState({ uncheckedUsers });
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
    const { uncheckedUsers, checkedUsers } = this.state;

    return (
      <div className="app-container">
        <div className="phone-container">
          <CardStackContainer
            onUpdateCardPosition={this._handleUpdateCardPosition}
            uncheckedUsers={uncheckedUsers}
            checkedUsers={checkedUsers}
          />
        <ItsAMatchOverlay open named={checkedUsers.last().get('name')} />
        </div>
      </div>
    );
  }
}

export default App;
