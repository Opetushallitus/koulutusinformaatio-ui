import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Media from 'react-media';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HakuStore from './stores/haku-store'
import UrlStore from './stores/url-store'
import {Provider} from 'mobx-react';
import Sidebar from "./components/Sidebar";
import Header from './components/Header';
import Footer from './components/Footer';
import MobileFooter from './components/MobileFooter';
import Haku from "./components/haku/Haku";
import Etusivu from "./components/Etusivu";
import Koulutus from "./components/koulutus/Koulutus";
import Oppilaitos from "./components/oppilaitos/Oppilaitos";
import './assets/css/bootstrap.min.css'
import './assets/css/oph-styles-min.css';
import './assets/css/styles.css';
//import registerServiceWorker from './registerServiceWorker';

class App extends Component {

    urlStore = new UrlStore();
    hakuStore = new HakuStore();

    render() {
        const hakuStore = this.hakuStore;
        const urlStore = this.urlStore;
        return (

                <Provider hakuStore={hakuStore} urlStore={urlStore}>
                    <React.Fragment>
                        <div className="container-fluid navigation-bar"/>
                        <div className="overlay"></div>
                        <Sidebar/>
                        <div id="page-content-wrapper">
                            <Header/>
                            <Switch>
                                <Route exact path='/' component={Etusivu}/>
                                <Route path='/haku/:keyword' component={Haku}/>
                                <Route path='/haku' component={Haku}/>
                                <Route path='/koulutus/:oid' component={Koulutus}/>
                                <Route path='/oppilaitos/:oid' component={Oppilaitos}/>
                            </Switch>
                            <Media query="(max-width: 768px)">
                                {matches =>
                                    matches ? (
                                        <MobileFooter/>
                                    ) : (
                                        <Footer/>
                                    )
                                }
                            </Media>
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