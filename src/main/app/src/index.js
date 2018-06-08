import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HakuStore from './stores/haku-store'
import HakuehtoStore from './stores/hakuehto-store'
import UrlStore from './stores/url-store'
import {Provider} from 'mobx-react';
import Sidebar from "./components/common/Sidebar";
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Hakusivu from "./components/Hakusivu";
import Etusivu from "./components/Etusivu";
import './assets/css/font-awesome.min.css'
import './assets/css/bootstrap.min.css'
import './assets/css/oph-styles-min.css';
import './assets/css/styles.css';
//import registerServiceWorker from './registerServiceWorker';

class App extends Component {

    urlStore = new UrlStore();
    hakuStore = new HakuStore();
    hakuehtoStore = new HakuehtoStore();

    render() {
        const hakuStore = this.hakuStore;
        const hakuehtoStore = this.hakuehtoStore;
        const urlStore = this.urlStore;
        return (

                <Provider hakuStore={hakuStore} urlStore={urlStore} hakuehtoStore={hakuehtoStore}>
                    <React.Fragment>
                        <div className="container-fluid navigation-bar"/>
                        <div className="overlay"></div>
                        <Sidebar/>
                        <div id="page-content-wrapper">
                            <Header/>
                            <Switch>
                                <Route exact path='/' component={Etusivu}/>
                                <Route path='/' component={Hakusivu}/>
                            </Switch>
                            <Footer/>
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