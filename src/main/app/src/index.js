import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/styles.scss';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { theme } from './theme';
import App from './App';
import { MuiThemeProvider } from '@material-ui/core';
import i18n from 'i18next';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker-custom.js');
}

i18n.init({
  react: {
    useSuspense: false,
  },
});

ReactDOM.render(
  <BrowserRouter basename={'/konfo'}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </BrowserRouter>,
  document.getElementById('wrapper')
);
