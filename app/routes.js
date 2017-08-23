import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import App from './components/App';
import OptionsPage from './components/OptionsPage';
import OpenedTasksPage from './components/OpenedTasksPage';

export default (defaultPath) => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to={`/${defaultPath || 'opened-tasks'}`} />
      <Route path="/options" component={OptionsPage} />
      <Route path="/opened-tasks" component={OpenedTasksPage} />
    </Route>
  )
};
