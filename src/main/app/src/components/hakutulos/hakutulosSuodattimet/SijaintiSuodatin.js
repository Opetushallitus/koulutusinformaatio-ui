import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Select, { components } from 'react-select';
import qs from 'query-string';
import _ from 'lodash';
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, SearchOutlined } from '@material-ui/icons';
import {
  clearOffsetAndPaging,
  searchAll,
  setSijainti,
  setSelectedSijainti,
} from '#/src/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getSijaintiFilterProps,
} from '#/src/reducers/hakutulosSliceSelector';
import {
  SuodatinCheckbox,
  SuodatinExpansionPanel,
  SuodatinExpansionPanelDetails,
  SuodatinExpansionPanelSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import SummaryContent from './SummaryContent';
import { colors } from '#/src/colors';

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
  const sijaintiFilterProps = useSelector(getSijaintiFilterProps);
  const apiRequestParams = useSelector(getAPIRequestParams);
  const dispatch = useDispatch();

  const [firstFiveMaakunnat, setfirstFiveMaakunnat] = useState([]);
  const [restMaakunnat, setRestMaakunnat] = useState([]);
  const [showRest, setShowRest] = useState(false);
  const [searchHitsSijainnit, setSearchHitsSijainnit] = useState([]);
  const [selectedSijainnit, setSelectedSijainnit] = useState([]);
  const [checkedMaakunnat, setCheckedMaakunnat] = useState([]);
  const [selectedSijainnitStr, setSelectedSijainnitStr] = useState('');

  useEffect(() => {
    setfirstFiveMaakunnat(sijaintiFilterProps.firstFiveMaakunnat);
    setRestMaakunnat(sijaintiFilterProps.restMaakunnat);
    setSelectedSijainnit(sijaintiFilterProps.selectedSijainnit);
    setSearchHitsSijainnit(sijaintiFilterProps.searchHitsSijainnit);
    setCheckedMaakunnat(sijaintiFilterProps.checkedMaakunnat);
    setSelectedSijainnitStr(sijaintiFilterProps.selectedSijainnitStr);
  }, [sijaintiFilterProps, location]);

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
    _setCheckedMaakunnat(newValitutMaakunnat);
  };

  const handleSelectedSijannitToggle = (_selectedSijainti) => {
    if (
      _.size(_selectedSijainti) > 0 &&
      _selectedSijainti.constructor === Object &&
      _selectedSijainti.isMaakunta
    ) {
      return handleSelectedSijaintiIsMaakunta(_selectedSijainti);
    }

    const newSelectedSijainnit = [...selectedSijainnit, _selectedSijainti] || [];
    const selectedSijainnitStr = [
      ...new Set(
        newSelectedSijainnit
          .map(({ id }) => id)
          .concat(checkedMaakunnat.map(({ id }) => id))
      ),
    ].join(',');
    const search = qs.parse(history.location.search);

    setSelectedSijainnit(newSelectedSijainnit);
    dispatch(setSelectedSijainti({ newSelectedSijainnit }));
    search.sijainti = selectedSijainnitStr;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(_.pickBy(search), _.identity) });
    dispatch(clearOffsetAndPaging());
    dispatch(searchAll({ ...apiRequestParams, sijainti: selectedSijainnitStr }));
  };

  const handleSelectedSijaintiIsMaakunta = (_selectedSijainti) => {
    if (checkedMaakunnat.findIndex(({ id }) => id === _selectedSijainti.id) !== -1)
      return;
    const maakuntaFilterObj = {
      id: _selectedSijainti?.id,
      name: _selectedSijainti?.name,
    };
    const newValitutMaakunnat = [...checkedMaakunnat, maakuntaFilterObj];
    _setCheckedMaakunnat(newValitutMaakunnat);
  };

  const _setCheckedMaakunnat = (newCheckedOrSelectedMaakunnat) => {
    const newCheckedOrSelectedSijainnitStr = newCheckedOrSelectedMaakunnat
      .map(({ id }) => id)
      .concat(selectedSijainnit.map(({ id }) => id))
      .join(',');
    const search = qs.parse(history.location.search);
    search.sijainti = newCheckedOrSelectedSijainnitStr;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(_.pickBy(search, _.identity)) });
    dispatch(setSijainti({ newCheckedOrSelectedMaakunnat }));
    dispatch(clearOffsetAndPaging());
    dispatch(
      searchAll({ ...apiRequestParams, sijainti: newCheckedOrSelectedSijainnitStr })
    );
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
    <SuodatinExpansionPanel elevation={elevation} defaultExpanded={expanded}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <SummaryContent
          selectedFiltersStr={selectedSijainnitStr}
          maxCharLengthBeforeChipWithNumber={20}
          filterName={t('haku.sijainti')}
          displaySelected={displaySelected}
        />
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
                          <Grid item>{maakuntaArray[1]?.nimi?.[i18n.language]}</Grid>
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
                            <Grid item>{maakuntaArray[1]?.nimi?.[i18n.language]}</Grid>
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

export default SijaintiSuodatin;
