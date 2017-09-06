import React from 'react';
import { Link } from 'react-router';
import style from './style.css';

class PopupNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className="nav justify-content-center mb-3">
        <li className="nav-item">
          <Link to="/opened-tasks" className="rounded p-2" activeClassName={style.navActive}>Open</Link>
        </li>
        <li className="nav-item">
          <Link to="/closed-tasks" className="rounded p-2" activeClassName={style.navActive}>Complete</Link>
        </li>
      </ul>
    );
  }
}

export default PopupNav;