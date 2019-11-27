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
class SijaintiSuodatin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maakunnat: [],
      valitutMaakunnat: [],
      kunnat: [],
      valitutKunnat: []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    const { hakuStore } = this.props;
    const maakunnatJS =
      hakuStore.toggle === 'koulutus'
        ? Object.entries(toJS(hakuStore.koulutusFilters.maakunta))
        : Object.entries(toJS(hakuStore.oppilaitosFilters.maakunta));
    const kunnatJS =
      hakuStore.toggle === 'koulutus'
        ? Object.entries(toJS(hakuStore.koulutusFilters.kunta))
        : Object.entries(toJS(hakuStore.oppilaitosFilters.kunta));

    maakunnatJS.sort((a, b) => b[1].count - a[1].count);

    this.setState({ maakunnat: maakunnatJS, kunnat: kunnatJS });

  }

  handleMaakuntaToggle = kuntaId => () => {
    const currentIndex = this.state.valitutMaakunnat.indexOf(kuntaId);
    const newValitutMaakunnat = [...this.state.valitutMaakunnat];
    if (currentIndex === -1) {
      newValitutMaakunnat.push(kuntaId);
    } else {
      newValitutMaakunnat.splice(currentIndex, 1);
    }
    this.setState({ valitutMaakunnat: newValitutMaakunnat });
  };

  render() {
    const { classes, i18n } = this.props;
    console.log(this.state.valitutMaakunnat);
    console.log(this.state.kunnat);
    // console.log(toJS(this.props.hakuStore.koulutusFilters.kunta));

    return (
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Sijainti</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List style={{ width: '100%' }}>
            {this.state.maakunnat.map(maakuntaArray => {
              const labelId = `educationtype-outerlist-label-${maakuntaArray[0]}`;
              console.log(maakuntaArray);
              return (
                <React.Fragment>
                  <ListItem key={maakuntaArray[0]} dense button onClick={this.handleMaakuntaToggle(maakuntaArray[0])}>
                    <ListItemIcon>
                      <Checkbox
                        classes={{ root: classes.listItemCheckbox }}
                        edge="start"
                        checked={this.state.valitutMaakunnat.indexOf(maakuntaArray[0]) !== -1}
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
                          <Grid item>{maakuntaArray[1].nimi.fi}</Grid>
                          <Grid item>{`(${maakuntaArray[1].count})`}</Grid>
                        </Grid>
                      }
                    ></ListItemText>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

const SijaintiSuodatinWithStyles = withTranslation()(withStyles(styles)(SijaintiSuodatin));

export default withRouter(SijaintiSuodatinWithStyles);
