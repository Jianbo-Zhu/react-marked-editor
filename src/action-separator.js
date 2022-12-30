import React, { Component } from 'react';
import propTypes from 'prop-types';
import './action-separator.css';
class ActionSeparator extends Component {
  render() {
    const styles = {
      wrapper: {
        height: this.props.height,
        width: this.props.width
      },
      sep: {
        height: this.props.height,
        width: this.props.thickness
      }
    }
    return (
      <div style={styles.wrapper} className="wrapper">
        <div style={styles.sep} className="sep"></div>
      </div>
    );
  }
}
ActionSeparator.propTypes = {
  thickness: propTypes.number,
  width: propTypes.number,
  height: propTypes.number
};
ActionSeparator.defaultProps = {
  thickness: 1,
  width: 24,
  height: 24
}

export default ActionSeparator;