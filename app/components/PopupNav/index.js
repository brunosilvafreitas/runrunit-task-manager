import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import style from './style.css';

class PopupNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className="nav justify-content-center mb-3">
        <li className="nav-item">
          <FormattedMessage id="openedTasks.menuItem">
            {(txt) => (<Link to="/opened-tasks" className="rounded p-2" activeClassName={style.navActive}>{txt}</Link>)}
          </FormattedMessage>
        </li>
        <li className="nav-item">
          <FormattedMessage id="closedTasks.menuItem">
            {(txt) => (<Link to="/closed-tasks" className="rounded p-2" activeClassName={style.navActive}>{txt}</Link>)}
          </FormattedMessage>
        </li>
      </ul>
    );
  }
}

export default PopupNav;