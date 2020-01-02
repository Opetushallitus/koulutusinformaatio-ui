import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
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
  Grid,
} from '@material-ui/core';
import { ExpandMore, SearchOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import Select, { components } from 'react-select';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';
import { styles } from '../../../styles';
import { colors } from '../../../colors';
import { useStores } from '../../../hooks';

const SijaintiSuodatin = observer((props) => {
  const { classes, i18n, history } = props;
  const { hakuStore } = useStores();
  const { koulutusFilters, oppilaitosFilters, toggle, filter } = hakuStore;
  const { sijainti } = filter;

  const [maakunnat, setMaakunnat] = useState([]);
  const [kunnat, setKunnat] = useState([]);
  const [selectedSijainnit, setSelectedSijainnit] = useState([]);
  const [valitutSijainnit, setValitutSijainnit] = useState([]);

  useEffect(() => {
    const maaKunnatJS =
      toggle === 'koulutus'
        ? Object.entries(toJS(koulutusFilters.maakunta))
        : Object.entries(toJS(oppilaitosFilters.maakunta));
    const kunnatJS =
      toggle === 'koulutus'
        ? Object.entries(toJS(koulutusFilters.kunta))
        : Object.entries(toJS(oppilaitosFilters.kunta));

    maaKunnatJS.sort((a, b) => b[1].count - a[1].count);
    const filteredKunnat = kunnatJS.filter((kunta) => kunta[1].count > 0);
    const filteredMaaKunnat = maaKunnatJS.filter(
      (maakunta) => maakunta[1].count > 0
    );
    const selectKunnat = filteredKunnat.reduce(
      (kuntaAccum, kunta, kuntaIndex) => {
        return [
          ...kuntaAccum,
          {
            label: `${kunta[1].nimi[i18n.language]} (${kunta[1].count})`,
            value: kunta[1].nimi[i18n.language],
            isMaakunta: false,
            id: kunta[0],
            name: kunta[1].nimi,
          },
        ];
      },
      []
    );
    const selectKunnatAndMaakunnat = filteredMaaKunnat.reduce(
      (accumulator, maaKunta, kuntaIndex) => {
        return [
          ...accumulator,
          {
            label: `${maaKunta[1].nimi[i18n.language]} (${maaKunta[1].count})`,
            value: maaKunta[1].nimi[i18n.language],
            isMaakunta: true,
            id: maaKunta[0],
            name: maaKunta[1].nimi,
          },
        ];
      },
      selectKunnat
    );
    setMaakunnat(maaKunnatJS);
    setKunnat(selectKunnatAndMaakunnat);
    setValitutSijainnit(toJS(sijainti));
  }, [
    props,
    hakuStore,
    sijainti,
    toggle,
    koulutusFilters.maakunta,
    koulutusFilters.kunta,
    oppilaitosFilters.maakunta,
    oppilaitosFilters.kunta,
    i18n.language,
  ]);

  const handleMaakuntaToggle = (maakuntaArr) => () => {
    const maakuntaFilterObj = {
      id: maakuntaArr[0],
      name: maakuntaArr[1]?.nimi,
    };
    const newValitutSijainnit = [...valitutSijainnit];
    const newSelectedSijainnit = [...selectedSijainnit];
    const currentIndex = valitutSijainnit.findIndex(
      ({ id }) => id === maakuntaFilterObj.id
    );

    if (currentIndex !== -1) {
      newValitutSijainnit.splice(currentIndex, 1);
    } else {
      newValitutSijainnit.push(maakuntaFilterObj);
    }
    setValitutSijainnit(newValitutSijainnit);
    setHakuStoreSijaintiFilter(newValitutSijainnit, newSelectedSijainnit);
  };

  const handleSelectedSijannitToggle = (selectedSijainnit) => {
    const newSelectedSijainnit = selectedSijainnit || [];
    setSelectedSijainnit(newSelectedSijainnit);
    setHakuStoreSijaintiFilter(valitutSijainnit, newSelectedSijainnit);
  };

  const setHakuStoreSijaintiFilter = (
    newValitutSijainnit,
    _selectedSijainnit
  ) => {
    const selectedSijainnit = _selectedSijainnit || [];
    const combinedValitutSijainnit = selectedSijainnit.reduce(
      (valitutSijainnitAccu, selectedSijainti, index) => {
        if (
          !valitutSijainnitAccu.find(({ id }) => id === selectedSijainti.id)
        ) {
          return [
            ...valitutSijainnitAccu,
            { id: selectedSijainti.id, name: selectedSijainti.name },
          ];
        }
        return valitutSijainnitAccu;
      },
      newValitutSijainnit
    );
    const search = qs.parse(history.location.search);
    search.sijainti = combinedValitutSijainnit.map(({ id }) => id).join(',');
    history.replace({ search: qs.stringify(search) });
    hakuStore.setSijaintiFilter(combinedValitutSijainnit);
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  const DropdownIndicator = (props) => {
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
      borderRadius: '2px',
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: 'none',
    }),
    indicatorContainer: (provided, state) => ({
      ...provided,
      padding: '6px',
    }),
  };

  return (
    <ExpansionPanel defaultExpanded={true}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">Sijainti</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container direction="column">
          <Grid item style={{ padding: '20px 0' }}>
            ToDo: 'Etsi paikkakunta tai alue' - input-filter
          </Grid>
          <Grid item>
            <List style={{ width: '100%' }}>
              {maakunnat.map((maakuntaArray) => {
                const labelId = `educationtype-outerlist-label-${maakuntaArray[0]}`;
                return (
                  <ListItem
                    key={maakuntaArray[0]}
                    id={maakuntaArray[0]}
                    dense
                    button
                    disabled={maakuntaArray[1].count === 0}
                    onClick={handleMaakuntaToggle(maakuntaArray)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        classes={{ root: classes.listItemCheckbox }}
                        edge="start"
                        checked={
                          valitutSijainnit.findIndex(
                            ({ id }) => id === maakuntaArray[0]
                          ) !== -1
                        }
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.hakuTulosListItemText }}
                      id={labelId}
                      primary={
                        <Grid container justify="space-between" wrap="nowrap">
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
});

const SijaintiSuodatinWithStyles = withTranslation()(
  withStyles(styles)(SijaintiSuodatin)
);

export default withRouter(SijaintiSuodatinWithStyles);
