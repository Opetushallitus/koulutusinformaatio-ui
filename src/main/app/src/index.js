import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render((
    <BrowserRouter basename={'/konfo'}>
        <App />
    </BrowserRouter>
), document.getElementById('root'));


//registerServiceWorker auheuttaa ongelmia kutsuttaessa
//backendin config/frontProperties-rajapintaa, koska
//se ohjaa sen react-sovellukseen, jos reactin puolella
//on käyty. On muutenkin ongelmallinen, ks:
//https://github.com/facebook/create-react-app/issues/2398
//https://github.com/ReactTraining/react-router/issues/5520

//TODO: Poistetaanko kokonaan?
//registerServiceWorker();