import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HakuStore from './stores/haku-store'
import UrlStore from './stores/url-store'
import {Provider} from 'mobx-react';
import Sidebar from "./components/Sidebar";
import Header from './components/Header';
import Haku from "./components/Haku";
import Etusivu from "./components/Etusivu";
import Koulutus from "./components/Koulutus";
//import registerServiceWorker from './registerServiceWorker';
import './assets/css/bootstrap.min.css'
import './assets/css/oph-styles-min.css';
import './assets/css/styles.css';

class App extends Component {

    urlStore = new UrlStore();
    hakuStore = new HakuStore();

    render() {
        const hakuStore = this.hakuStore;
        const urlStore = this.urlStore;
        return (

                <Provider hakuStore={hakuStore} urlStore={urlStore}>
                    <React.Fragment>
                        <div class="container-fluid navigation-bar"/>
                        <div class="overlay"></div>
                        <Sidebar/>
                        <div id="page-content-wrapper">
                            <Header/>
                            <Switch>
                                <Route exact path='/' component={Etusivu}/>
                                <Route path='/haku' component={Haku}/>
                                <Route path='/koulutus' component={Koulutus}/>
                            </Switch>
                        </div>
                    </React.Fragment>
                </Provider>

        );
    }
}

ReactDOM.render((
    <BrowserRouter basename={'/konfo'}>
        <App/>
    </BrowserRouter>
), document.getElementById('wrapper'));

//registerServiceWorker auheuttaa ongelmia kutsuttaessa
//backendin config/frontProperties-rajapintaa, koska
//se ohjaa sen react-sovellukseen, jos reactin puolella
//on käyty. On muutenkin ongelmallinen, ks:
//https://github.com/facebook/create-react-app/issues/2398
//https://github.com/ReactTraining/react-router/issues/5520

//TODO: Poistetaanko kokonaan?
//registerServiceWorker();