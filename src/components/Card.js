import React, { Component, PropTypes } from 'react';
import './Card.css';

class Card extends Component {
  constructor() {
    super();

    // this.state = {
    //   dragging: false,
    //   percentage: 0,
    //   translateY: 0,
    //   clientX: 0,
    //   clientY: 0,
    //   rotationMultiplier: 1
    // };

    this._centerPoint = 0;
    this._rotationAnchor = 0;
    this._leftEdge = 0;
    this._rightEdge = 0;
    this._width = 0;

    this._calculatePercentageMoved = this._calculatePercentageMoved.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._componentDimensions = this._componentDimensions.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.percentage !== this.props.percentage;
  }

  _calculatePercentageMoved(clientX) {
    return (clientX - this._startXPosition) / (this._width / 100);
  }

  _handleTouchStart(event) {
    this._handleMouseDown(event.nativeEvent.touches[0]);
  }

  _handleTouchMove(event) {
    this._handleMouseMove(event.nativeEvent.touches[0]);
  }

  _handleMouseDown(event) {
    const { onUpdateCardPosition, id } = this.props;
    const { clientX, clientY } = event;

    this._startXPosition = clientX;
    this._startYPosition = clientY;

    onUpdateCardPosition(id, {
      dragging: true,
      rotationMultiplier: clientY >= this._centerPoint ? 1 : -1,
      percentage: 0
    });
  }

  _handleMouseUp() {
    const { onUpdateCardPosition, id } = this.props;
    const { dragging } = this.props;

    if (dragging) {
      this._startXPosition = 0;
      this._startYPosition = 0;

      onUpdateCardPosition(id, {
        dragging: false,
        translateY: 0,
        percentage: 0
      });
    }
  }

  _handleMouseMove(event) {
    const { onUpdateCardPosition, id } = this.props;
    const { dragging } = this.props;
    const { clientX, clientY } = event;

    if (dragging) {
      onUpdateCardPosition(id, {
        clientY,
        translateY: clientY - this._startYPosition,
        percentage: this._calculatePercentageMoved(clientX)
      });
    }
  }

  _componentDimensions(cmpt) {
    if (cmpt) {
      const {
        top,
        height,
        left,
        width
      } = cmpt.getBoundingClientRect();

      this._centerPoint = top + (height / 2);
      this._rotationAnchor = ((left - (width / 2)) / 3600);
      this._leftEdge = left;
      this._rightEdge = left + width;

      this._width = width;
    }
  }

  _getContainerStyle() {
    const {
      percentage,
      translateY,
      dragging,
      rotationMultiplier
    } = this.props;

    return {
      transform: `
      translateX(${percentage}%)
      translateY(${translateY}px)
      rotate(${(
        (this._rotationAnchor * -1) * percentage
      ) * rotationMultiplier}deg)`,
      transition: dragging ? 'none' : undefined
    };
  }

  _getLabelOpacity() {
    const { percentage } = this.props;
    const opacity = (((this._rotationAnchor) * percentage) / 10);

    return {
      dislikeOpacity: {
        opacity: opacity * -1
      },
      likeOpacity: {
        opacity
      }
    };
  }

  _getStyle() {
    return {
      container: this._getContainerStyle(),
      ...this._getLabelOpacity()
    }
  }

  render() {
    const {
      name,
      age,
      profileImage
    } = this.props;

    const {
      container,
      dislikeOpacity,
      likeOpacity
    } = this._getStyle();

    return (
      <div
        onTouchStart={this._handleTouchStart}
        onTouchMove={this._handleTouchMove}
        onTouchEnd={this._handleMouseUp}
        onMouseUp={this._handleMouseUp}
        onMouseMove={this._handleMouseMove}
        onMouseDown={this._handleMouseDown}
        style={container}
        ref={this._componentDimensions}
        className="card">
        <div
          className="card__image"
          style={{ backgroundImage: `url(${profileImage})` }}>
          <div className="card__label">
            <div
              style={likeOpacity}
              className="card__label-text card__label-text--like">
              Like
            </div>
          </div>
          <div className="card__label--dummy" />
          <div className="card__label">
            <div
              style={dislikeOpacity}
              className="card__label-text card__label-text--nope">
              Nope
            </div>
          </div>
        </div>
        <div className="card__information">
          <span className="card__name">
            {name},
          </span>
          <span className="card__age">
            {age}
          </span>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  id: PropTypes.string,
  profileImage: PropTypes.string,
  onUpdateCardPosition: PropTypes.func
};

export default Card;
