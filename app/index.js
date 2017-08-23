import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';

const appContainer = document.getElementById('runrunTMApp');
const path = appContainer.getAttribute('path') || '';

import routes from './routes';

render((
  <Router history={hashHistory} routes={routes(path)} />
), appContainer);