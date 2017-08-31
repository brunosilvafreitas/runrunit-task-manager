import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

import style from './style.css';

class LoadingIcon extends React.Component{
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <span className={`loading_icon ${(this.props.visible)?style.loadingIcon:''}`}  aria-hidden="true" ></span>
    );
  }
}

LoadingIcon.propTypes = {
  visible: PropTypes.bool.isRequired
};

export default LoadingIcon;