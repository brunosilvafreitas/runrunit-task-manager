import React from 'react';
import style from './style.css';
import PropTypes from 'prop-types';

class PopupHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header>
        <a href="https://secure.runrun.it/en-US/tasks" target="_blank"><img src="images/runrun.png" className={style.RunrunIcon} /></a>
        <a href="options.html" target="_blank"><img src="/open-iconic/svg/cog.svg" className={style.Settings} /></a>
        <h1 className="text-center">{this.props.title}</h1> 
      </header>
    );
  }
}

PopupHeader.propTypes = {
  title: PropTypes.string.isRequired
};

export default PopupHeader;