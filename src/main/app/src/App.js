import React, { useState } from 'react';
import './assets/styles/styles.scss';
import { Switch, Route } from 'react-router-dom';
import KonfoStore from './stores/konfo-store';
import { Provider } from 'mobx-react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Hakusivu from './components/Hakusivu';
import Etusivu from './components/Etusivu';
import PalautePopup from "./components/palaute/PalautePopup";
import SideMenu from "./components/common/SideMenu";
import Sisaltohaku from "./components/Sisaltohaku";
import i18n from './tools/i18n';
import { I18nextProvider } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { styles } from './styles';

const konfoStore = new KonfoStore();

const App = props => {
  const hakuStore = konfoStore.hakuStore;
  const hakuehtoStore = konfoStore.hakuehtoStore;
  const urlStore = konfoStore.urlStore;
  const restStore = konfoStore.restStore;
  const navigaatioStore = konfoStore.navigaatioStore;
  const vertailuStore = konfoStore.vertailuStore;
  const contentfulStore = konfoStore.contentfulStore;
  contentfulStore.fetchData();

  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <Provider
      hakuStore={hakuStore}
      urlStore={urlStore}
      hakuehtoStore={hakuehtoStore}
      restStore={restStore}
      navigaatioStore={navigaatioStore}
      vertailuStore={vertailuStore}
      contentfulStore={contentfulStore}
    >
      <I18nextProvider i18n={i18n} initialLanguage={'fi'}>
        <React.Fragment>
          <div id="page-content-wrapper">
            <Header toggleMenu={toggleMenu} isOpen={menuVisible} />
            {menuVisible ? <SideMenu closeMenu={closeMenu} /> : null}
            <div id="app-main-content" className={menuVisible ? 'menu-visible' : 'menu-invisible'}>
              <Switch>
                <Route exact path="/" component={Etusivu} />
                <Route path="/sisaltohaku/" component={Sisaltohaku} />
                <Route path="/" component={Hakusivu} />
              </Switch>
              <Footer changeLanguage={this.changeLanguage} />
            </div>
          </div>
          <PalautePopup />
        </React.Fragment>
      </I18nextProvider>
    </Provider>
  );
};

const AppWithStyles = withStyles(styles, { withTheme: true })(App);

export default AppWithStyles;
