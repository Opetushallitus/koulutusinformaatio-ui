import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import superagent from 'superagent';
import { MuiThemeProvider } from '@material-ui/core';
import { getKonfoStore } from './store';
import { theme } from './theme';
import App from './App';
import 'typeface-open-sans';
import configure from './urls/urlUtil';
import ScrollToTop from './ScrollToTop';

import './tools/i18n';
import LoadingCircle from './components/common/LoadingCircle';

if ('serviceWorker' in navigator) {
  if (!window.Cypress) {
    console.log('Registering service worker');
    navigator.serviceWorker
      .register('/konfo/service-worker-custom.js', { scope: '/konfo/' })
      .then(
        function (registration) {
          console.log('Service worker registration succeeded:', registration);
        },
        /*catch*/ function (error) {
          console.log('Service worker registration failed:', error);
        }
      );
  } else {
    console.log('Not registering service worker');
  }
}

window.onerror = (errorMsg, url, line, col, errorObj) => {
  superagent.post('/konfo-backend/client-error').send({
    'error-message': errorMsg,
    url: url,
    line: line,
    col: col,
    'user-agent': window.navigator.userAgent,
    stack: '' + errorObj,
  });
};

configure();

ReactDOM.render(
  <Suspense fallback={<LoadingCircle />}>
    <Provider store={getKonfoStore()}>
      <BrowserRouter basename={'/konfo'}>
        <MuiThemeProvider theme={theme}>
          <ScrollToTop />
          <App />
        </MuiThemeProvider>
      </BrowserRouter>
    </Provider>
  </Suspense>,
  document.getElementById('wrapper')
);
