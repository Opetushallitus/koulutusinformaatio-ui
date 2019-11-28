import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { HomeOutlined } from '@material-ui/icons';
import { Grid, Paper, Typography } from '@material-ui/core';
import { Localizer as l } from '../../tools/Utils';
import HakutulosToggleWrapper from './HakutulosToggleWrapper';
import HakutulosSummary from './HakutulosSummary';
import HakutulosSuodattimet from './HakutulosSuodattimet';
import HakutulosBox from '../common/HakutulosBox';
import VertailuBox from './VertailuBox';
import '../../assets/styles/components/_hakutulos.scss';
import { styles } from '../../styles';
import { withTranslation } from 'react-i18next';

@inject('hakuStore', 'vertailuStore')
@observer
class Hakutulos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleKoulutus: undefined,
    };
  }

  updateState() {
    this.setState({
      toggleKoulutus: true,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.updateState();
  }

  componentDidMount(nextProps) {
    this.props = nextProps;
  }

  getKoulutusNimi(koulutus) {
    return l.localize(koulutus, this.props.t('koulutus.ei-nimeä'), 'fi');
  }

  getKoulutusAiheet(koulutus) {
    if (koulutus.aiheet && 0 < koulutus.aiheet.length) {
      return koulutus.aiheet
        .map((a) => l.localize(a, null))
        .filter((a) => a != null)
        .join(', ');
    }
    return '';
  }

  getOppilaitosNimi(oppilaitos) {
    return l.localize(oppilaitos, this.props.t('oppilaitos.ei-nimeä'), 'fi');
  }

  getOsaamisala(koulutus) {
    const osaamisala = l.localize(koulutus.osaamisala, undefined);
    if (osaamisala) {
      return osaamisala;
    }
    const koulutusohjelma = l.localize(koulutus.koulutusohjelma, undefined);
    if (koulutusohjelma) {
      return koulutusohjelma;
    }
    return '';
  }

  renderResultList() {
    const vertailuActive = this.props.vertailuStore.size < 3;
    if (this.props.hakuStore.toggleKoulutus) {
      return this.props.hakuStore.koulutusResult.map((r) => {
        console.log(this.getKoulutusNimi(r));
        // console.log(Object.entries(r));
        const link =
          '/koulutus/' +
          r.oid +
          '?haku=' +
          encodeURIComponent(this.props.hakuStore.createHakuUrl) +
          '&lng=' +
          l.getLanguage();
        return (
          <HakutulosBox
            key={r.oid}
            oid={r.oid}
            vertailuOid={r.oid}
            tyyppi={r.koulutustyyppi}
            haettavissa={r.hakuOnKaynnissa}
            nimi={this.getKoulutusNimi(r)}
            link={link}
            text1={this.getOsaamisala(r)} //osaamisalat = ammattinimikkeet ammatillisessa? entä miten kk ylempi/alempi tarkistetaan?
            text2={''}
            vertailu={vertailuActive}
          />
        );
      });
    } else {
      return this.props.hakuStore.oppilaitosResult.map((r) => {
        const link =
          '/oppilaitos/' +
          r.oid +
          '?haku=' +
          encodeURIComponent(this.props.hakuStore.createHakuUrl) +
          '&lng=' +
          l.getLanguage();
        return (
          <HakutulosBox
            key={r.oid}
            oid={r.oid}
            tyyppi={r.tyyppi}
            haettavissa={false}
            nimi={this.getOppilaitosNimi(r)}
            link={link}
            text1={r.kayntiosoite ? r.kayntiosoite : ''}
            text2={r.postitoimipaikka ? r.postitoimipaikka : ''}
            vertailu={false}
          />
        );
      });
    }
  }

  render() {
    const { t, classes } = this.props;
    if (!this.props.hakuStore.keywordSet && !this.props.hakuStore.filterSet) {
      return (
        <React.Fragment>
          <div className="container">
            <div className="row result-count">
              <div className="col-12">
                <h1 aria-live="assertive">
                  {t('haku.lisää-hakusana-tai-rajain')}
                </h1>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <VertailuBox />
        <Grid className={classes.hakutulosSisalto} container spacing={3}>
          <Paper
            className={classes.hakuTulosSisaltoPaperi}
            id="hakutulos-content"
          >
            <Grid
              container
              item
              xs={12}
              alignItems="center"
              className={classes.hakuTulosNavText}
            >
              <Grid>
                <HomeOutlined />
              </Grid>
              <Grid item>
                <Box component="span" ml={2}>
                  Etusivu
                </Box>
                <Box component="span" ml={2}>
                  Hakutulokset
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <HakutulosSummary iDidUpdate={this.props.iUpdatedMyChildren} />
            </Grid>
            <Grid
              container
              alignItems="center"
              className={classes.hakutulosToggleBarMargins}
            >
              <Grid item xs={3}>
                <Typography variant="h5">{t('haku.rajaa-tuloksia')}</Typography>
              </Grid>
              <Grid id="toggle-tabs" item xs={7}>
                <HakutulosToggleWrapper />
              </Grid>
              <Grid item xs={2}>
                <Typography align="right">Järjestä: Nimi A-Ö</Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={3} className={classes.hakutulosFiltersGrid}>
                <HakutulosSuodattimet />
              </Grid>
              <Grid item xs={9}>
                <div id="search-results">
                  <div className="row">{this.renderResultList()}</div>
                </div>
              </Grid>
            </Grid>
            {/* <Sivutus /> */}
          </Paper>
        </Grid>
      </React.Fragment>
    );
  }
}

const HakuTulosWithStyles = withTranslation()(withStyles(styles)(Hakutulos));

export default HakuTulosWithStyles;
