import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';
import qs from 'query-string';
import _fp from 'lodash/fp';
import {
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, SearchOutlined } from '@material-ui/icons';
import {
  clearPaging,
  searchAll,
  setSijainti,
  setSelectedSijainti,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getIsLoading,
  getSijaintiFilterProps,
} from '#/src/store/reducers/hakutulosSliceSelector';
import {
  SuodatinCheckbox,
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import SummaryContent from './SummaryContent';
import { colors } from '#/src/colors';
import { Common as C, Localizer as l } from '#/src/tools/Utils';
import { useQueryParams } from '#/src/hooks';

const useStyles = makeStyles(() => ({
  buttonLabel: {
    fontSize: 14,
  },
  noBoxShadow: {
    boxShadow: 'none',
  },
}));

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '34px',
    borderRadius: '2px',
    cursor: 'text',
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

// Overridden react-select components
const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <SearchOutlined />
  </components.DropdownIndicator>
);

const LoadingIndicator = () => <CircularProgress size={25} color="inherit" />;

const Option = ({ data, innerProps, isFocused }) => (
  // innerProps contain interaction functions e.g. onClick
  <ListItem dense button {...innerProps} selected={isFocused}>
    <SuodatinCheckbox
      checked={data?.checked}
      disableRipple
      role="presentation"
      style={{ pointerEvents: 'none' }}
    />
    {data?.label}
  </ListItem>
);

const isChecked = (arr, value) => arr.some((o) => o.id === value.id);

export const SijaintiSuodatin = ({
  expanded,
  elevation,
  displaySelected,
  summaryHidden = false,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const loading = useSelector(getIsLoading);
  const sijaintiFilterProps = useSelector(getSijaintiFilterProps) || {};
  const {
    firstFiveMaakunnat,
    restMaakunnat,
    selectedSijainnit,
    searchHitsSijainnit = [],
    checkedMaakunnat,
    selectedSijainnitStr = '',
  } = sijaintiFilterProps;
  const apiRequestParams = useQueryParams();
  const dispatch = useDispatch();

  const [showRest, setShowRest] = useState(false);

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
  };

  const handleSelectedSijannitToggle = (selected) => {
    if (selected?.isMaakunta) {
      return handleSelectedSijaintiIsMaakunta(selected);
    }

    const wasSelected = selectedSijainnit.some(({ id }) => id === selected.id);
    const newSelectedSijainnit = wasSelected
      ? selectedSijainnit.filter(({ id }) => id !== selected.id)
      : [...selectedSijainnit, selected] || [];
    const selectedSijainnitStr = newSelectedSijainnit
      .map(({ id }) => id)
      .concat(checkedMaakunnat.map(({ id }) => id))
      .join(',');
    const search = qs.parse(history.location.search);

    dispatch(setSelectedSijainti({ newSelectedSijainnit }));
    search.sijainti = selectedSijainnitStr;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(C.cleanRequestParams(search)) });
    dispatch(clearPaging());
    dispatch(searchAll({ ...apiRequestParams, sijainti: selectedSijainnitStr }));
  };

  const handleSelectedSijaintiIsMaakunta = (checked) => {
    const wasChecked = checkedMaakunnat.some(({ id }) => id === checked.id);

    const maakuntaFilterObj = {
      id: checked?.id,
      name: checked?.name,
    };
    const newValitutMaakunnat = wasChecked
      ? checkedMaakunnat.filter(({ id }) => id !== checked.id)
      : [...checkedMaakunnat, maakuntaFilterObj];

    setCheckedMaakunnat(newValitutMaakunnat);
  };

  const setCheckedMaakunnat = (newCheckedOrSelectedMaakunnat) => {
    const newCheckedOrSelectedSijainnitStr = newCheckedOrSelectedMaakunnat
      .map(({ id }) => id)
      .concat(selectedSijainnit.map(({ id }) => id))
      .join(',');
    const search = qs.parse(history.location.search);
    search.sijainti = newCheckedOrSelectedSijainnitStr;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(C.cleanRequestParams(search)) });
    dispatch(setSijainti({ newCheckedOrSelectedMaakunnat }));
    dispatch(clearPaging());
    dispatch(
      searchAll({ ...apiRequestParams, sijainti: newCheckedOrSelectedSijainnitStr })
    );
  };

  const groupedSijainnit = useMemo(
    () => [
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: _fp.compose([
          _fp.sortBy('label'),
          _fp.map((h) => ({ ...h, checked: isChecked(selectedSijainnit, h) })),
          _fp.filter((h) => !h.isMaakunta),
        ])(searchHitsSijainnit),
      },
      {
        label: t('haku.maakunnat'),
        options: _fp.compose([
          _fp.sortBy('label'),
          _fp.map((h) => ({ ...h, checked: isChecked(checkedMaakunnat, h) })),
          _fp.filter((h) => h.isMaakunta),
        ])(searchHitsSijainnit),
      },
    ],
    [searchHitsSijainnit, selectedSijainnit, checkedMaakunnat, t]
  );

  return (
    <SuodatinAccordion
      {...(summaryHidden && { className: classes.noBoxShadow })}
      elevation={elevation}
      defaultExpanded={expanded}>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            selectedFiltersStr={selectedSijainnitStr}
            maxCharLengthBeforeChipWithNumber={20}
            filterName={t('haku.sijainti')}
            displaySelected={displaySelected}
          />
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container direction="column">
          <Grid item style={{ padding: '20px 0' }}>
            <Select
              components={{ DropdownIndicator, LoadingIndicator, Option }}
              styles={customStyles}
              value=""
              isLoading={loading}
              name="district-search"
              options={groupedSijainnit}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder={t('haku.etsi-paikkakunta-tai-alue')}
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
          {!summaryHidden && (
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
                          style={{ pointerEvents: 'none' }}
                        />
                      </ListItemIcon>
                      <SuodatinListItemText
                        id={labelId}
                        primary={
                          <Grid container justify="space-between" wrap="nowrap">
                            <Grid item>{l.localize(maakuntaArray[1])}</Grid>
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
                              <Grid item>{l.localize(maakuntaArray[1])}</Grid>
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
                  onClick={() => setShowRest(!showRest)}>
                  {showRest ? t('haku.näytä_vähemmän') : t('haku.näytä_lisää')}
                </Button>
              </List>
            </Grid>
          )}
        </Grid>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
