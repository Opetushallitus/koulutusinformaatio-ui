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
      opetusKieli: {},
      valitutOpetusKielet: []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    const { hakuStore } = this.props;
    const opetusKieliJS =
      hakuStore.toggle === 'koulutus'
        ? toJS(hakuStore.koulutusFilters.opetusKieli)
        : toJS(hakuStore.oppilaitosFilters.opetusKieli);
    console.log(toJS(hakuStore.filter.opetusKielet));

    this.setState({ opetusKieli: opetusKieliJS });
  }

  handleLanguageToggle = kieliId => () => {
    const { hakuStore, history } = this.props;
    const currentIndex = this.state.valitutOpetusKielet.indexOf(kieliId);
    const valitutOpetusKielet = [...this.state.valitutOpetusKielet];
    
    if (currentIndex === -1) {
      valitutOpetusKielet.push(kieliId);
    } else {
      valitutOpetusKielet.splice(currentIndex, 1);
    }

    this.setState({ valitutOpetusKielet: valitutOpetusKielet });
    console.log(valitutOpetusKielet);
    // this.setState({ selectedTab: newValue });
    const search = qs.parse(history.location.search);
    search.opetuskieli = valitutOpetusKielet.join(',');
    hakuStore.setOpetusKieliFilter(valitutOpetusKielet);
    history.replace({ search: qs.stringify(search) });
    console.log(history.location.search);


  };

  render() {
    const { classes, i18n } = this.props;

    return (
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Opetuskieli</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List style={{ width: '100%' }}>
            {Object.keys(this.state.opetusKieli).map(opetuskieliKey => {
              const labelId = `language-list-label-${opetuskieliKey}`;
              return (
                <ListItem
                  key={opetuskieliKey}
                  dense
                  button
                  onClick={this.handleLanguageToggle(opetuskieliKey)}
                  disabled={this.state.opetusKieli[opetuskieliKey].count === 0}
                >
                  <ListItemIcon>
                    <Checkbox
                      classes={{ root: classes.listItemCheckbox }}
                      edge="start"
                      checked={this.state.valitutOpetusKielet.indexOf(opetuskieliKey) !== -1}
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
                        <Grid item>{this.state.opetusKieli[opetuskieliKey].nimi[i18n.language]}</Grid>
                        <Grid item>{`(${this.state.opetusKieli[opetuskieliKey].count})`}</Grid>
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
