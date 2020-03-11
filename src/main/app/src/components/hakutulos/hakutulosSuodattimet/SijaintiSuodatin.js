import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, SearchOutlined } from '@material-ui/icons';
import Select, { components } from 'react-select';
import qs from 'query-string';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../colors';
import { useStores } from '../../../hooks';
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelSummary,
  SuodatinExpansionPanelDetails,
  SuodatinCheckbox,
  SuodatinListItemText,
  SuodatinMobileChip,
} from './CustomizedMuiComponents';

const useStyles = makeStyles((theme) => ({
  buttonLabel: {
    fontSize: 14,
  },
}));

const SijaintiSuodatin = ({ expanded, elevation, displaySelected }) => {
  const history = useHistory();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const classes = useStyles();
  const { hakuStore } = useStores();
  const { koulutusFilters, oppilaitosFilters, toggle, filter } = hakuStore;
  const { sijainti, selectedsijainnit } = filter;

  const [firstFiveMaakunnat, setfirstFiveMaakunnat] = useState([]);
  const [restMaakunnat, setRestMaakunnat] = useState([]);
  const [showRest, setShowRest] = useState(false);
  const [searchHitsSijainnit, setSearchHitsSijainnit] = useState([]);
  const [selectedSijainnit, setSelectedSijainnit] = useState([]);
  const [checkedMaakunnat, setCheckedMaakunnat] = useState([]);

  useEffect(() => {
    const maaKunnatJS =
      toggle === 'koulutus'
        ? Object.entries(koulutusFilters.maakunta)
        : Object.entries(oppilaitosFilters.maakunta);
    const kunnatJS =
      toggle === 'koulutus'
        ? Object.entries(koulutusFilters.kunta)
        : Object.entries(oppilaitosFilters.kunta);

    let orderedMaakunnat = _.orderBy(
      maaKunnatJS,
      ['[1].count', `[1].nimi.[${i18n.language}]`],
      ['desc', 'asc']
    );
    const removedEiTiedossaMaakunta = _.remove(
      orderedMaakunnat,
      (n) => n[0] === 'maakunta_99'
    );
    orderedMaakunnat = _.concat(orderedMaakunnat, removedEiTiedossaMaakunta);
    const filteredMaaKunnat = orderedMaakunnat.filter(
      (maakunta) => maakunta[1].count > 0
    );
    const filteredKunnat = kunnatJS.filter((kunta) => kunta[1].count > 0);

    const selectKunnat = filteredKunnat.reduce(
      (kuntaAccum, kunta, kuntaIndex) => {
        return [
          ...kuntaAccum,
          {
            label: `${kunta[1]?.nimi?.[i18n.language]} (${kunta[1]?.count})`,
            value: kunta[1]?.nimi?.[i18n.language],
            isMaakunta: false,
            id: kunta[0],
            name: kunta[1]?.nimi,
          },
        ];
      },
      []
    );
    const _searchHitsSijainnit = filteredMaaKunnat.reduce(
      (accumulator, maaKunta, kuntaIndex) => {
        return [
          ...accumulator,
          {
            label: `${maaKunta[1]?.nimi?.[i18n.language]} (${
              maaKunta[1]?.count
            })`,
            value: maaKunta[1]?.nimi?.[i18n.language],
            isMaakunta: true,
            id: maaKunta[0],
            name: maaKunta[1]?.nimi,
          },
        ];
      },
      selectKunnat
    );
    setfirstFiveMaakunnat(_.slice(orderedMaakunnat, 0, 5));
    setRestMaakunnat(_.slice(orderedMaakunnat, 5, orderedMaakunnat.length));
    setSelectedSijainnit(filter.selectedsijainnit);
    setSearchHitsSijainnit(_searchHitsSijainnit);
    setCheckedMaakunnat(sijainti);
  }, [
    i18n.language,
    koulutusFilters.kunta,
    koulutusFilters.maakunta,
    location,
    oppilaitosFilters.kunta,
    oppilaitosFilters.maakunta,
    filter.selectedsijainnit,
    sijainti,
    toggle,
  ]);

  const handleMaakuntaToggle = (maakuntaArr) => () => {
    const maakuntaFilterObj = {
      id: maakuntaArr[0],
      name: maakuntaArr[1]?.nimi,
    };
    const newValitutMaakunnat = [...checkedMaakunnat];
    const currentIndex = checkedMaakunnat.findIndex(
      ({ id }) => id === maakuntaFilterObj.id
    );

    if (currentIndex !== -1) {
      newValitutMaakunnat.splice(currentIndex, 1);
    } else {
      newValitutMaakunnat.push(maakuntaFilterObj);
    }
    setCheckedMaakunnat(newValitutMaakunnat);
    setHakuStoreSijaintiFilter(newValitutMaakunnat);
  };

  const handleSelectedSijaintiIsMaakunta = (_selectedSijainti) => {
    if (
      checkedMaakunnat.findIndex(({ id }) => id === _selectedSijainti.id) !== -1
    )
      return;
    const maakuntaFilterObj = {
      id: _selectedSijainti?.id,
      name: _selectedSijainti?.name,
    };
    const newValitutMaakunnat = [...checkedMaakunnat, maakuntaFilterObj];
    setHakuStoreSijaintiFilter(newValitutMaakunnat);
  };

  const handleSelectedSijannitToggle = (_selectedSijainti) => {
    const selectedSijaintitObjEntry = Object.entries(_selectedSijainti);

    if (
      selectedSijaintitObjEntry.length > 0 &&
      _selectedSijainti.constructor === Object &&
      _selectedSijainti.isMaakunta
    ) {
      return handleSelectedSijaintiIsMaakunta(_selectedSijainti);
    }

    const newSelectedSijainnit =
      [...selectedSijainnit, _selectedSijainti] || [];
    const combinedSijainnit = [
      ...new Set(
        newSelectedSijainnit
          .map(({ id }) => id)
          .concat(checkedMaakunnat.map(({ id }) => id))
      ),
    ];
    const search = qs.parse(history.location.search);

    setSelectedSijainnit(newSelectedSijainnit);
    search.sijainti = combinedSijainnit.join(',');
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(search) });
    hakuStore.setSelectedSijaintiFilter(newSelectedSijainnit);
    hakuStore.clearOffsetAndPaging();
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  const setHakuStoreSijaintiFilter = (newValitutKunnat) => {
    const search = qs.parse(history.location.search);
    search.sijainti = newValitutKunnat
      .map(({ id }) => id)
      .concat(selectedSijainnit.map(({ id }) => id))
      .join(',');
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(search) });
    hakuStore.setSijaintiFilter(newValitutKunnat);
    hakuStore.clearOffsetAndPaging();
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  const handleShowRest = () => {
    setShowRest(!showRest);
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

  const SelectedSijainnit = () => {
    let _selectedSijainnit = _.map(checkedMaakunnat, `name.${i18n.language}`);
    _selectedSijainnit = _.concat(
      _selectedSijainnit,
      _.map(selectedSijainnit, 'value')
    );
    let selectedSijainnitStr = _.join(_selectedSijainnit, ', ');
    if (_.inRange(_.size(selectedSijainnitStr), 0, 20)) {
      return selectedSijainnitStr;
    }
    return <SuodatinMobileChip label={_.size(_selectedSijainnit)} />;
  };

  return (
    <SuodatinExpansionPanel elevation={elevation} defaultExpanded={expanded}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap">
          <Grid item>
            <Typography variant="subtitle1">{t('haku.sijainti')}</Typography>
          </Grid>
          {displaySelected && (
            <Grid item>
              <SelectedSijainnit />
            </Grid>
          )}
        </Grid>
      </SuodatinExpansionPanelSummary>
      <SuodatinExpansionPanelDetails>
        <Grid container direction="column">
          <Grid item style={{ padding: '20px 0' }}>
            <Select
              components={{ DropdownIndicator }}
              styles={customStyles}
              value=""
              name="district-search"
              options={searchHitsSijainnit}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Etsi paikkakunta tai alue"
              onChange={(e) => handleSelectedSijannitToggle(e)}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: colors.greyMuiListOnHover,
                  primary: colors.green,
                },
              })}
            />
          </Grid>
          <Grid item>
            <List style={{ width: '100%' }}>
              {firstFiveMaakunnat.map((maakuntaArray) => {
                const labelId = `educationtype-outerlist-label-${maakuntaArray[0]}`;
                return (
                  <ListItem
                    key={maakuntaArray[0]}
                    id={maakuntaArray[0]}
                    dense
                    button
                    disabled={maakuntaArray[1].count === 0}
                    onClick={handleMaakuntaToggle(maakuntaArray)}>
                    <ListItemIcon>
                      <SuodatinCheckbox
                        edge="start"
                        checked={
                          checkedMaakunnat.findIndex(
                            ({ id }) => id === maakuntaArray[0]
                          ) !== -1
                        }
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <SuodatinListItemText
                      id={labelId}
                      primary={
                        <Grid container justify="space-between" wrap="nowrap">
                          <Grid item>
                            {maakuntaArray[1]?.nimi?.[i18n.language]}
                          </Grid>
                          <Grid item>{`(${maakuntaArray[1]?.count})`}</Grid>
                        </Grid>
                      }
                    />
                  </ListItem>
                );
              })}
              {showRest &&
                restMaakunnat.map((maakuntaArray) => {
                  const labelId = `educationtype-outerlist-label-${maakuntaArray[0]}`;
                  return (
                    <ListItem
                      key={maakuntaArray[0]}
                      id={maakuntaArray[0]}
                      dense
                      button
                      disabled={maakuntaArray[1].count === 0}
                      onClick={handleMaakuntaToggle(maakuntaArray)}>
                      <ListItemIcon>
                        <SuodatinCheckbox
                          edge="start"
                          checked={
                            checkedMaakunnat.findIndex(
                              ({ id }) => id === maakuntaArray[0]
                            ) !== -1
                          }
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <SuodatinListItemText
                        id={labelId}
                        primary={
                          <Grid container justify="space-between" wrap="nowrap">
                            <Grid item>
                              {maakuntaArray[1]?.nimi?.[i18n.language]}
                            </Grid>
                            <Grid item>{`(${maakuntaArray[1]?.count})`}</Grid>
                          </Grid>
                        }
                      />
                    </ListItem>
                  );
                })}
              <Button
                color="secondary"
                size="small"
                classes={{ label: classes.buttonLabel }}
                endIcon={showRest ? <ExpandLess /> : <ExpandMore />}
                fullWidth
                onClick={() => handleShowRest()}>
                {showRest ? t('haku.näytä_vähemmän') : t('haku.näytä_lisää')}
              </Button>
            </List>
          </Grid>
        </Grid>
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
};

export default observer(SijaintiSuodatin);
