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
class KoulutusTyyppiSuodatin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      koulutusTyypit: {},
      valitutKoulutusTyypit: []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    const { hakuStore } = this.props;
    const koulutusTyypitJS =
      hakuStore.toggle === 'koulutus' ? toJS(hakuStore.koulutusFilters.koulutusTyyppi) : toJS(hakuStore.oppilaitosFilters.koulutusTyyppi);

    this.setState({ koulutusTyypit: koulutusTyypitJS });
  }

  handleEduTypeToggle = tyyppi => () => {
    const currentIndex = this.state.valitutKoulutusTyypit.indexOf(tyyppi);
    const valitutKoulutusTyypit = [...this.state.valitutKoulutusTyypit];
    if (currentIndex === -1) {
      valitutKoulutusTyypit.push(tyyppi);
    } else {
      valitutKoulutusTyypit.splice(currentIndex, 1);
    }
    this.setState({ valitutKoulutusTyypit: valitutKoulutusTyypit });
  };

  render() {
    const { classes, i18n } = this.props;

    return (
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">KoulutusTyyppi</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List style={{ width: '100%' }}>
            {Object.keys(this.state.koulutusTyypit).map(eduTypeOuterListKey => {
              const labelId = `educationtype-outerlist-label-${eduTypeOuterListKey}`;
              return (
                <React.Fragment>
                  <ListItem key={eduTypeOuterListKey} dense button onClick={this.handleEduTypeToggle(eduTypeOuterListKey)}>
                    <ListItemIcon>
                      <Checkbox
                        classes={{ root: classes.listItemCheckbox }}
                        edge="start"
                        checked={this.state.valitutKoulutusTyypit.indexOf(eduTypeOuterListKey) !== -1}
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
                          <Grid item>{this.state.koulutusTyypit[eduTypeOuterListKey].nimi.fi}</Grid>
                          <Grid item>{`(${this.state.koulutusTyypit[eduTypeOuterListKey].count})`}</Grid>
                        </Grid>
                      }
                    ></ListItemText>
                  </ListItem>
                  {this.state.koulutusTyypit[eduTypeOuterListKey].alakoodit &&
                    Object.keys(this.state.koulutusTyypit[eduTypeOuterListKey].alakoodit).map(eduTypeInnerListkey => {
                      return (
                        <ListItem
                          className={classes.eduTypeInnerListPadding}
                          key={`${eduTypeOuterListKey}_${eduTypeInnerListkey}`}
                          dense
                          button
                          onClick={this.handleEduTypeToggle(eduTypeInnerListkey)}
                        >
                          <ListItemIcon>
                            <Checkbox
                              classes={{ root: classes.listItemCheckbox }}
                              edge="start"
                              checked={this.state.valitutKoulutusTyypit.indexOf(eduTypeInnerListkey) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            classes={{ primary: classes.hakuTulosListItemText }}
                            id={`this ${labelId}_${eduTypeInnerListkey}`}
                            primary={
                              <Grid container justify="space-between">
                                <Grid item>
                                  {this.state.koulutusTyypit[eduTypeOuterListKey].alakoodit[eduTypeInnerListkey].nimi[i18n.language]}
                                </Grid>
                                <Grid item>
                                  {`(${this.state.koulutusTyypit[eduTypeOuterListKey].alakoodit[eduTypeInnerListkey].count})`}
                                </Grid>
                              </Grid>
                            }
                          ></ListItemText>
                        </ListItem>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

const KoulutusTyyppiSuodatinWithStyles = withTranslation()(withStyles(styles)(KoulutusTyyppiSuodatin));

export default withRouter(KoulutusTyyppiSuodatinWithStyles);
