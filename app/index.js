import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';

import routes from './routes';

const appContainer = document.getElementById('runrunTMApp');
sessionStorage.initialPath = appContainer.getAttribute('path') || '';

render((
  <Router history={hashHistory} routes={routes} />
), appContainer);