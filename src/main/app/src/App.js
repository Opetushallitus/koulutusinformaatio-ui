import React, { useState, useEffect } from 'react';

import { MuiThemeProvider, makeStyles, useMediaQuery } from '@material-ui/core';
import clsx from 'clsx';
import { Provider } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, Redirect } from 'react-router-dom';

import { NotFound } from '#/src/NotFound';
import { supportedLanguages } from '#/src/tools/i18n';

import { Draft } from './components/common/Draft';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import SideMenu from './components/common/SideMenu';
import { Etusivu } from './components/Etusivu';
import { Haku } from './components/haku/Haku';
import { Hakupalkki } from './components/haku/Hakupalkki';
import { KoulutusPage } from './components/koulutus/KoulutusPage';
import { OppilaitosPage } from './components/oppilaitos/OppilaitosPage';
import PalautePopup from './components/palaute/PalautePopup';
import Palvelut from './components/palvelu/Palvelut';
import { ReactiveBorder } from './components/ReactiveBorder';
import Sisaltohaku from './components/Sisaltohaku';
import SivuRouter from './components/sivu/SivuRouter';
import Toteutus from './components/toteutus/Toteutus';
import {
  ValintaperustePage,
  ValintaperustePreviewPage,
} from './components/valintaperusteet/ValintaperustePage';
import { DRAWER_WIDTH } from './constants';
import { useStores } from './hooks';
import KonfoStore from './stores/konfo-store';
import { theme } from './theme';

const konfoStore = new KonfoStore();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    minWidth: 0,
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -DRAWER_WIDTH,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  smContent: {
    minWidth: 0,
    flexGrow: 1,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: '-100%',
  },
  smContentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const KoulutusHakuBar = () => (
  <div style={{ margin: 'auto', paddingTop: '50px', maxWidth: '1600px' }}>
    <ReactiveBorder>
      <Hakupalkki />
    </ReactiveBorder>
  </div>
);

const TranslatedRoutes = ({ match, location }) => {
  const { i18n } = useTranslation();
  const selectedLanguage = match.params.lng;

  const { contentfulStore } = useStores();
  useEffect(() => {
    if (supportedLanguages.includes(selectedLanguage)) {
      contentfulStore.reset(selectedLanguage);
      i18n.changeLanguage(selectedLanguage);
    }
  }, [i18n, selectedLanguage, contentfulStore]);

  if (!supportedLanguages.includes(selectedLanguage)) {
    const newLocation = {
      ...location,
      pathname: '/fi' + location.pathname,
    };
    return <Redirect to={newLocation} />;
  }
  return supportedLanguages.includes(selectedLanguage) ? (
    <Switch>
      <Route exact path="/:lng">
        <Etusivu />
      </Route>
      <Route exact path="/:lng/sisaltohaku/">
        <Sisaltohaku />
      </Route>
      <Route exact path="/:lng/haku/:keyword?">
        <KoulutusHakuBar />
        <Haku />
      </Route>
      <Route exact path="/:lng/koulutus/:oid">
        <KoulutusHakuBar />
        <KoulutusPage />
      </Route>
      <Route exact path="/:lng/oppilaitos/:oid">
        <KoulutusHakuBar />
        <OppilaitosPage />
      </Route>
      <Route exact path="/:lng/oppilaitososa/:oid">
        <KoulutusHakuBar />
        <OppilaitosPage oppilaitosOsa />
      </Route>
      <Route exact path="/:lng/toteutus/:oid">
        <KoulutusHakuBar />
        <Toteutus />
      </Route>
      <Route exact path="/:lng/sivu/:id">
        <KoulutusHakuBar />
        <SivuRouter />
      </Route>
      <Route exact path="/:lng/hakukohde/:hakukohdeOid/valintaperuste">
        <KoulutusHakuBar />
        <ValintaperustePage />
      </Route>
      <Route exact path="/:lng/valintaperuste/:valintaperusteId">
        <KoulutusHakuBar />
        <ValintaperustePreviewPage />
      </Route>
      <Route component={NotFound} />
    </Switch>
  ) : (
    <Route component={NotFound} />
  );
};

const App = () => {
  const classes = useStyles();
  const contentfulStore = konfoStore.contentfulStore;

  const matches = useMediaQuery('(max-width: 600px)');

  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <Provider contentfulStore={contentfulStore}>
      <MuiThemeProvider theme={theme}>
        <React.Fragment>
          <div className={classes.root}>
            <Draft />
            <Header toggleMenu={toggleMenu} isOpen={menuVisible} />
            <SideMenu small={matches} menuVisible={menuVisible} closeMenu={closeMenu} />
            <main
              id="app-main-content"
              className={clsx(matches ? classes.smContent : classes.content, {
                [matches ? classes.smContentShift : classes.contentShift]: menuVisible,
              })}>
              <Route path="/:lng?" component={TranslatedRoutes} />
              <Palvelut />
              <Footer />
            </main>
          </div>
          <PalautePopup />
        </React.Fragment>
      </MuiThemeProvider>
    </Provider>
  );
};

export default App;
