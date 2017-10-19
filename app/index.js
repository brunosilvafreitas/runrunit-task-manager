import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { addLocaleData, IntlProvider } from 'react-intl';
import translations from './translations';

const ptLocaleData = require('react-intl/locale-data/pt');
addLocaleData(ptLocaleData);

const appContainer = document.getElementById('runrunTMApp');
const path = appContainer.getAttribute('path') || '';

import routes from './routes';

render((
  <IntlProvider locale={translations().locale} messages={translations().messages}>
    <Router history={hashHistory} routes={routes(path)} />
  </IntlProvider>
), appContainer);