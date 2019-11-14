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
import '../../assets/styles/components/_hakutulos-toggle.scss';
import { withTranslation } from 'react-i18next';
import { styles } from '../../styles';

@inject('hakuStore')
@observer
class HakutulosSuodattimet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.hakuStore.toggleKoulutus ? 0 : 1,
      selectedLanguages: []
    };
    this.handleSelectedTab = this.handleSelectedTab.bind(this);
    this.handleLanguageToggle = this.handleLanguageToggle.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  handleSelectedTab(event, newValue) {
    this.setState({ selectedTab: newValue });
    const search = qs.parse(this.props.history.location.search);
    search.toggle = newValue === 0 ? 'koulutus' : 'oppilaitos';
    this.props.history.replace({ search: qs.stringify(search) });
  }

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
    const { koulutusResult, oppilaitosResult } = hakuStore;
    const objKoulutukset = toJS(koulutusResult);
    const objOppilatokset = toJS(oppilaitosResult);
    console.log(Object.entries(toJS(hakuStore)));
    console.log(objKoulutukset);
    console.log(objOppilatokset);


    return (
      <React.Fragment>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Opetuskieli</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List style={{ width: '100%' }}>
              {['Suomi', 'Englanti', 'Ruotsi'].map(lang => {
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
                          <Grid item>{`(${0})`}</Grid>
                        </Grid>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">KoulutusTyyppi</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>Test</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Sijainti</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>Test</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Koulutusalat</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>Test</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </React.Fragment>
    );
  }
}

const HakutulosSuodattimetWithStyles = withStyles(styles)(HakutulosSuodattimet);

export default withTranslation()(withRouter(HakutulosSuodattimetWithStyles));
