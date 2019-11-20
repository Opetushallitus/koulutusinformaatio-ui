import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Checkbox,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Grid
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';
import { styles } from '../../../styles';

@inject('hakuStore')
@observer
class OpetusKieliSuodatin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.hakuStore.toggle === 'koulutus' ? 0 : 1,
      selectedLanguages: [],
      oppilaitosFilters: {
        opp_language_fi: [],
        opp_language_sv: [],
        opp_language_en: []
      },
      koulutusFilters: {
        koul_language_fi: [],
        koul_language_sv: [],
        koul_language_en: []
      }
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    const { hakuStore } = this.props;
    const oppilaitosFilters = { ...this.state.oppilaitosFilters };
    const koulutusFilters = {
      koul_language_fi: [],
      koul_language_sv: [],
      koul_language_en: []
    };
    const { koulutusResult, oppilaitosResult } = hakuStore;
    const objKoulutukset = toJS(koulutusResult);

    objKoulutukset.map(koulutusObj => {
      const { kielivalinta = [] } = koulutusObj;

      kielivalinta.forEach(langKey => {
        switch (langKey) {
          case 'fi':
            koulutusFilters.koul_language_fi.push(koulutusObj);
            break;
          case 'sv':
            koulutusFilters.koul_language_sv.push(koulutusObj);
            break;
          case 'en':
            koulutusFilters.koul_language_en.push(koulutusObj);
            break;
          default:
            break;
        }
      });
    });
    this.setState({ koulutusFilters: koulutusFilters });
  }

  handleSelectedTab = (event, newValue) => {
    this.setState({ selectedTab: newValue });
    const search = qs.parse(this.props.history.location.search);
    search.toggle = newValue === 0 ? 'koulutus' : 'oppilaitos';
    this.props.history.replace({ search: qs.stringify(search) });
  };

  handleLanguageToggle = language => () => {
    const currentIndex = this.state.selectedLanguages.indexOf(language);
    const newSelectedLanguages = [...this.state.selectedLanguages];
    if (currentIndex === -1) {
      newSelectedLanguages.push(language);
    } else {
      newSelectedLanguages.splice(currentIndex, 1);
    }
    this.setState({ selectedLanguages: newSelectedLanguages });
  };

  render() {
    const { classes, hakuStore } = this.props;

    return (
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Opetuskieli</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List style={{ width: '100%' }}>
            {Object.keys(this.state.koulutusFilters).map(lang => {
              const labelId = `language-list-label-${lang}`;
              return (
                <ListItem key={lang} dense button onClick={this.handleLanguageToggle(lang)}>
                  <ListItemIcon>
                    <Checkbox
                      classes={{ root: classes.listItemCheckbox }}
                      edge="start"
                      checked={this.state.selectedLanguages.indexOf(lang) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.hakuTulosListItemText }}
                    id={labelId}
                    primary={
                      <Grid container justify="space-between">
                        <Grid item>{lang}</Grid>
                        <Grid item>{`(${this.state.koulutusFilters[lang].length})`}</Grid>
                      </Grid>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

const OpetusKieliSuodatinWithStyles = withTranslation()(withStyles(styles)(OpetusKieliSuodatin));

export default withRouter(OpetusKieliSuodatinWithStyles);
