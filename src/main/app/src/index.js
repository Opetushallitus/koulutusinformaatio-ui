import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/styles.scss';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import { theme } from './theme';
import App from './App';
import { MuiThemeProvider } from '@material-ui/core';
import i18n from 'i18next';

if ('serviceWorker' in navigator) {
  !window.Cypress &&
    navigator.serviceWorker.register('./service-worker-custom.js');
}

i18n.init({
  react: {
    useSuspense: false,
  },
  lng: 'fi',
});

ReactDOM.render(
  <BrowserRouter basename={'/konfo'}>
    <MuiThemeProvider theme={theme}>
      {/* TODO: ScrollToTop should be removed as currently you will 
      always scroll to top when address changes and no scroll history is kept */}
      <ScrollToTop />
      <App />
    </MuiThemeProvider>
  </BrowserRouter>,
  document.getElementById('wrapper')
);
