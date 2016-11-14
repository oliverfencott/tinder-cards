import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  constructor() {
    super();

    this.state = {
      dragging: false,
      translateX: 0,
      translateY: 0
    };

    this._centerPoint = 0;
    this._rotationAnchor = 0;
    this._leftEdge = 0;
    this._rightEdge = 0;

    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._componentDimensions = this._componentDimensions.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
  }

  _handleTouchStart(event) {
    this._handleMouseDown(event.nativeEvent.touches[0]);
  }

  _handleTouchMove(event) {
    this._handleMouseMove(event.nativeEvent.touches[0]);
  }

  _handleMouseDown(event) {
    const { clientX, clientY } = event;

    this._startXPosition = clientX;
    this._startYPosition = clientY;

    this.setState({
      dragging: true,
      rotationMultiplier: clientY >= this._centerPoint ? 1 : -1
    });
  }

  _handleMouseUp() {
    const { dragging } = this.state;

    if (dragging) {
      this._startXPosition = 0;
      this._startYPosition = 0;

      this.setState({
        dragging: false,
        translateX: 0,
        translateY: 0
      });
    }
  }

  _handleMouseMove(event) {
    const { dragging } = this.state;
    const { clientX, clientY } = event;

    if (dragging) {
      this.setState({
        clientX,
        clientY,
        translateX: clientX - this._startXPosition,
        translateY: clientY - this._startYPosition,
      });
    }
  }

  _componentDimensions(cmpt) {
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
  }

  _getContainerStyle() {
    const {
      translateX,
      translateY,
      dragging,
      rotationMultiplier
    } = this.state;

    return {
      transform: `
      translateX(${translateX}px)
      translateY(${translateY}px)
      rotate(${(
        (this._rotationAnchor * -1) * translateX
      ) * rotationMultiplier}deg)`,
      transition: dragging ? 'none' : undefined
    };
  }

  _getLabelOpacity() {
    const { translateX } = this.state;
    const opacity = (((this._rotationAnchor) * translateX) / 10);

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

export default Card;
