import React, { Component } from 'react';
import propTypes from 'prop-types';
import "./action-button.css";
class ActionButton extends Component {
  render() {
    const styles = {
      wrapper: {
        height: this.props.height,
        width: this.props.width
      },
      btn: {
        height: this.props.height - 2,
        width: this.props.width - 2,
        lineHeight: (this.props.width - 2) + 'px'
      }
    }
    return (
      <div style={styles.wrapper} className="wrapper" title={this.props.title}>
        <div className={this.props.isSelect ? 'btn btn-select' : 'btn'}
          style={styles.btn} onClick={this.props.onClick}>
          {this.props.text
            ? <i className={`fa ${this.props.iconClass ? 'fa-' + this.props.iconClass : ''} text-btn`}>{this.props.text}</i>
            : <i className={`fa ${this.props.iconClass ? 'fa-' + this.props.iconClass : ''}`}></i>}
        </div>
      </div>
    );
  }
}
ActionButton.propTypes = {
  text: propTypes.string,
  iconClass: propTypes.string,
  width: propTypes.number,
  height: propTypes.number,
  onClick: propTypes.func,
  title: propTypes.string,
  isSelect: propTypes.bool
};
ActionButton.defaultProps = {
  iconClass: '',
  width: 24,
  height: 24,
  isSelect: false
}

export default ActionButton;