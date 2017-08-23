import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import App from './components/App';
import OptionsPage from './components/OptionsPage';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to={
        (sessionStorage.initialPath) ?
        `/${sessionStorage.initialPath}`:
        "/options"
      } />
    <Route path="/options" component={OptionsPage} />
  </Route>
);
