import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import KonfoStore from './stores/konfo-store';
import {Provider} from 'mobx-react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Hakusivu from "./components/Hakusivu";
import Etusivu from "./components/Etusivu";
import Sidebar from "./components/common/Sidebar";
import Palaute from "./components/common/Palaute";
import './assets/css/font-awesome.min.css';
import './assets/css/bootstrap.min.css';
import './assets/css/styles.css';
import i18n from './tools/i18n';
import { I18nextProvider } from 'react-i18next';
//import registerServiceWorker from './registerServiceWorker';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            togglePalaute: false
        };
        this.togglePalaute = this.togglePalaute.bind(this);
    }

    togglePalaute(val) {
        if (typeof val === "boolean") {
            this.setState({togglePalaute: val})
        } else {
            this.setState({togglePalaute: !this.state.togglePalaute})
        }
    }

    konfoStore = new KonfoStore();

    render() {
        const hakuStore = this.konfoStore.hakuStore;
        const hakuehtoStore = this.konfoStore.hakuehtoStore;
        const urlStore = this.konfoStore.urlStore;
        const restStore = this.konfoStore.restStore;
        const navigaatioStore = this.konfoStore.navigaatioStore;
        const vertailuStore = this.konfoStore.vertailuStore;

        return (
                <Provider hakuStore={hakuStore} urlStore={urlStore} hakuehtoStore={hakuehtoStore}
                          restStore={restStore} navigaatioStore={navigaatioStore} vertailuStore={vertailuStore}>
                    <I18nextProvider i18n={ i18n } initialLanguage={"fi"}>
                    <React.Fragment>
                        <div id="page-content-wrapper">
                            <Header/>
                            <Sidebar changeLanguage={this.changeLanguage} togglePalaute={this.togglePalaute}/>
                            <Switch>
                                <Route exact path='/' component={Etusivu}/>
                                <Route path='/' component={Hakusivu}/>
                            </Switch>
                            <Footer changeLanguage={this.changeLanguage} togglePalaute={this.togglePalaute}/>
                        </div>
                        {this.state.togglePalaute && <Palaute togglePalaute={this.togglePalaute}/>}
                    </React.Fragment>
                    </I18nextProvider>
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