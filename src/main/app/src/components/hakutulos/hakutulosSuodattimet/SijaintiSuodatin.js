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
import { ExpandMore, SearchOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import Select, { components } from 'react-select';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';
import { styles } from '../../../styles';
import { colors } from '../../../colors';

@inject('hakuStore')
@observer
class SijaintiSuodatin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maakunnat: [],
      valitutMaakunnat: [],
      kunnat: [],
      suodatutKunnat: [],
      valitutKunnat: []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    const { hakuStore, i18n } = this.props;
    const maakunnatJS =
      hakuStore.toggle === 'koulutus'
        ? Object.entries(toJS(hakuStore.koulutusFilters.maakunta))
        : Object.entries(toJS(hakuStore.oppilaitosFilters.maakunta));
    const kunnatJS =
      hakuStore.toggle === 'koulutus'
        ? Object.entries(toJS(hakuStore.koulutusFilters.kunta))
        : Object.entries(toJS(hakuStore.oppilaitosFilters.kunta));

    maakunnatJS.sort((a, b) => b[1].count - a[1].count);
    const filteredKunnat = kunnatJS.filter(kunta => kunta[1].count > 0);
    const filteredMaaKunnat = maakunnatJS.filter(maakunta => maakunta[1].count > 0);
    const selectKunnat = filteredKunnat.reduce((kunnaAccum, kunta, kuntaIndex) => {
      return [
        ...kunnaAccum,
        {
          label: `${kunta[1].nimi[i18n.language]} (${kunta[1].count})`,
          value: kunta[1].nimi[i18n.language],
          isMaakunta: false
        }
      ];
    }, []);
    const selectKunnatAndMaakunnat = filteredMaaKunnat.reduce((accumulator, maaKunta, kuntaIndex) => {
      return [
        ...accumulator,
        {
          label: `${maaKunta[1].nimi[i18n.language]} (${maaKunta[1].count})`,
          value: maaKunta[1].nimi[i18n.language],
          isMaakunta: true
        }
      ];
    }, selectKunnat);

    this.setState({ maakunnat: maakunnatJS, kunnat: kunnatJS, suodatutKunnat: selectKunnatAndMaakunnat });
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

  handlePaikkakuntaFilter(e) {
    const {history} = this.props;
    this.setState(prevState => {
      // console.log(e);
      return (prevState.valitutKunnat = e);
    })
    const search = qs.parse(history.location.search);
    // console.log(search);
  }

  render() {
    const { classes, i18n } = this.props;
    // console.log(this.state.valitutMaakunnat);
    // console.log(this.state.kunnat);
    // console.log(this.state.suodatutKunnat);
    // console.log(toJS(this.props.hakuStore.koulutusFilters.kunta));
    const DropdownIndicator = props => {
      return (
        components.DropdownIndicator && (
          <components.DropdownIndicator {...props}>
            <SearchOutlined />
          </components.DropdownIndicator>
        )
      );
    };

    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        minHeight: '34px',
        borderRadius: '2px'
      }),
      indicatorSeparator: (provided, state) => ({
        ...provided,
        display: 'none'
      }),
      indicatorContainer: (provided, state) => ({
        ...provided,
        padding: '6px'
      })
    };

    return (
      <ExpansionPanel defaultExpanded={false}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Sijainti</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container direction="column">
            <Grid item style={{ padding: '20px 0' }}>
              <Select
                components={{ DropdownIndicator }}
                styles={customStyles}
                isMulti
                name="district-search"
                options={this.state.suodatutKunnat}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Etsi paikkakunta tai alue"
                onChange={e => this.handlePaikkakuntaFilter(e)}
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: colors.greyMuiListOnHover,
                    primary: colors.green
                  }
                })}
              />

            </Grid>
            <Grid item>
              <List style={{ width: '100%' }}>
                {this.state.maakunnat.map(maakuntaArray => {
                  const labelId = `educationtype-outerlist-label-${maakuntaArray[0]}`;
                  // console.log(maakuntaArray);
                  return (
                      <ListItem
                        key={maakuntaArray[0]}
                        id={maakuntaArray[0]}
                        dense
                        button
                        onClick={this.handleMaakuntaToggle(maakuntaArray[0])}
                      >
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
                  );
                })}
              </List>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

const SijaintiSuodatinWithStyles = withTranslation()(withStyles(styles)(SijaintiSuodatin));

export default withRouter(SijaintiSuodatinWithStyles);
