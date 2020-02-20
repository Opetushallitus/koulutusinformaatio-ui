import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, SearchOutlined } from '@material-ui/icons';
import Select, { components } from 'react-select';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../colors';
import { useStores } from '../../../hooks';
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelSummary,
  SuodatinExpansionPanelDetails,
  SuodatinCheckbox,
  SuodatinListItemText,
} from './CutomizedMuiComponents';

const SijaintiSuodatin = observer(({ history, location }) => {
  const { i18n, t } = useTranslation();
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

    maaKunnatJS.sort((a, b) =>
      a[1].nimi?.[i18n.language] > b[1].nimi?.[i18n.language] ? 1 : -1
    );
    maaKunnatJS.sort((a, b) => b[1].count - a[1].count);
    const unknownMaakuntaIndex = maaKunnatJS.findIndex(
      (el) => el[0] === 'maakunta_99'
    );
    if (
      unknownMaakuntaIndex !== -1 &&
      maaKunnatJS[unknownMaakuntaIndex]?.[1]?.count === 0
    ) {
      maaKunnatJS.push(maaKunnatJS.splice(unknownMaakuntaIndex, 1)[0]);
    }
    const filteredKunnat = kunnatJS.filter((kunta) => kunta[1].count > 0);
    const filteredMaaKunnat = maaKunnatJS.filter(
      (maakunta) => maakunta[1].count > 0
    );
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
    const copyMaakunnatJS = [...maaKunnatJS];
    setfirstFiveMaakunnat(copyMaakunnatJS.splice(0, 5));
    setRestMaakunnat(copyMaakunnatJS);
    setSelectedSijainnit(selectedsijainnit);
    setSearchHitsSijainnit(_searchHitsSijainnit);
    setCheckedMaakunnat(sijainti);
  }, [
    i18n.language,
    koulutusFilters.kunta,
    koulutusFilters.maakunta,
    location,
    oppilaitosFilters.kunta,
    oppilaitosFilters.maakunta,
    selectedsijainnit,
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

  return (
    <SuodatinExpansionPanel defaultExpanded={true}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">{t('haku.sijainti')}</Typography>
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
                style={{ fontSize: 14 }}
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
});

export default withRouter(SijaintiSuodatin);
