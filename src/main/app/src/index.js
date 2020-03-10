import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import { theme } from './theme';
import App from './App';
import { MuiThemeProvider } from '@material-ui/core';
import i18n from 'i18next';
import 'typeface-open-sans';
import superagent from 'superagent';
import configure from './urls/urlUtil';
import rootReducer from './reducers';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

if ('serviceWorker' in navigator) {
  if (!window.Cypress) {
    console.log('Registering service worker');
    navigator.serviceWorker
      .register('./service-worker-custom.js', { scope: '/konfo/' })
      .then(
        function(registration) {
          console.log('Service worker registration succeeded:', registration);
        },
        /*catch*/ function(error) {
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

i18n.init({
  react: {
    useSuspense: false,
  },
  lng: 'fi',
});
configure();
const store = configureStore({
  reducer: rootReducer,
});
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
}
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={'/konfo'}>
      <MuiThemeProvider theme={theme}>
        {/* TODO: ScrollToTop should be removed as currently you will 
      always scroll to top when address changes and no scroll history is kept */}
        <ScrollToTop />
        <App />
      </MuiThemeProvider>
    </BrowserRouter>
    ,
  </Provider>,
  document.getElementById('wrapper')
);
