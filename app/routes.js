import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import App from './components/App';
import OptionsPage from './components/OptionsPage';
import OpenedTasksPage from './components/OpenedTasksPage';
import ClosedTasksPage from './components/ClosedTasksPage';

export default (defaultPath) => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to={`/${defaultPath || 'opened-tasks'}`} />
      <Route path="/options" component={OptionsPage} />
      <Route path="/opened-tasks" component={OpenedTasksPage} />
      <Route path="/closed-tasks" component={ClosedTasksPage} />
    </Route>
  )
};
