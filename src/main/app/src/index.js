import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/styles.scss';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { theme } from './theme';
import App from './App';
import { MuiThemeProvider } from '@material-ui/core';
//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter basename={'/konfo'}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </BrowserRouter>,
  document.getElementById('wrapper')
);

//registerServiceWorker auheuttaa ongelmia kutsuttaessa
//backendin config/frontProperties-rajapintaa, koska
//se ohjaa sen react-sovellukseen, jos reactin puolella
//on käyty. On muutenkin ongelmallinen, ks:
//https://github.com/facebook/create-react-app/issues/2398
//https://github.com/ReactTraining/react-router/issues/5520

//TODO: Poistetaanko kokonaan?
//registerServiceWorker();
