import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
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
  getAPIRequestParams,
  getSijaintiFilterProps,
  getIsLoading,
} from '#/src/store/reducers/hakutulosSliceSelector';
import {
  SuodatinCheckbox,
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import { SummaryContent } from './SummaryContent';
import { colors } from '#/src/colors';
import { Localizer as l } from '#/src/tools/Utils';
import { ElasticTuple, SuodatinProps } from './SuodatinTypes';
import { Translateable } from '#/src/types/common';
import { useUrlParams } from '../UseUrlParams';

const useStyles = makeStyles(() => ({
  buttonLabel: {
    fontSize: 14,
  },
  noBoxShadow: {
    boxShadow: 'none',
  },
}));

type Styles = React.ComponentProps<typeof Select>['styles'];
const customStyles: Styles = {
  control: (provided) => ({
    ...provided,
    minHeight: '34px',
    borderRadius: '2px',
    cursor: 'text',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    padding: '6px',
  }),
};

// Overridden react-select components

const LoadingIndicator = () => <CircularProgress size={25} color="inherit" />;

type RSDropdownIndicatorProps = React.ComponentProps<typeof components.DropdownIndicator>;
const DropdownIndicator = (props: RSDropdownIndicatorProps) => (
  <components.DropdownIndicator {...props}>
    <SearchOutlined />
  </components.DropdownIndicator>
);

type RSOptionProps = React.ComponentProps<typeof components.Option>;
type OptionProps = {
  data?: { label: string; checked: boolean };
  innerProps: RSOptionProps['innerProps'];
  isFocused: boolean;
};
const Option = ({ data, innerProps, isFocused }: OptionProps) => (
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

type Maakunta = {
  id: string;
  name: Translateable;
  isMaakunta: boolean;
  value?: string;
  label?: string;
};

const isChecked = (arr: Maakunta[], value: Maakunta) =>
  arr.some((o) => o.id === value.id);

type SijaintiFilterProps = {
  firstFiveMaakunnat: ElasticTuple[];
  restMaakunnat: ElasticTuple[];
  selectedSijainnit: Maakunta[];
  searchHitsSijainnit: Maakunta[];
  checkedMaakunnat: Maakunta[];
  selectedSijainnitStr: string;
};

export const SijaintiSuodatin = ({
  expanded,
  elevation,
  displaySelected,
  summaryHidden = false,
}: SuodatinProps) => {
  const { updateUrlSearchParams } = useUrlParams();
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
  }: SijaintiFilterProps = sijaintiFilterProps as any;
  const apiRequestParams = useSelector(getAPIRequestParams);
  const dispatch = useDispatch();

  const [showRest, setShowRest] = useState(false);

  const handleMaakuntaToggle = (maakuntaArr: ElasticTuple) => () => {
    const maakuntaFilterObj = {
      id: maakuntaArr[0],
      name: maakuntaArr[1]?.nimi,
      isMaakunta: true,
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

  const handleSelectedSijannitToggle = (selected: Maakunta) => {
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

    dispatch(setSelectedSijainti({ newSelectedSijainnit }));
    updateUrlSearchParams({ sijainti: selectedSijainnitStr });
    dispatch(clearPaging());
    dispatch(searchAll({ ...apiRequestParams, sijainti: selectedSijainnitStr }));
  };

  const handleSelectedSijaintiIsMaakunta = (checked: Maakunta) => {
    const wasChecked = checkedMaakunnat.some(({ id }) => id === checked.id);

    const maakuntaFilterObj = {
      id: checked?.id,
      name: checked?.name,
      isMaakunta: true,
    };
    const newValitutMaakunnat = wasChecked
      ? checkedMaakunnat.filter(({ id }) => id !== checked.id)
      : [...checkedMaakunnat, maakuntaFilterObj];

    setCheckedMaakunnat(newValitutMaakunnat);
  };

  const setCheckedMaakunnat = (newCheckedOrSelectedMaakunnat: Maakunta[]) => {
    const newCheckedOrSelectedSijainnitStr = newCheckedOrSelectedMaakunnat
      .map(({ id }) => id)
      .concat(selectedSijainnit.map(({ id }) => id))
      .join(',');
    updateUrlSearchParams({ sijainti: newCheckedOrSelectedSijainnitStr });
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
          _fp.map<Maakunta, Maakunta>((h) => ({
            ...h,
            checked: isChecked(selectedSijainnit, h),
          })),
          _fp.filter<Maakunta>((h) => !h.isMaakunta),
        ])(searchHitsSijainnit),
      },
      {
        label: t('haku.maakunnat'),
        options: _fp.compose([
          _fp.sortBy('label'),
          _fp.map<Maakunta, Maakunta>((h) => ({
            ...h,
            checked: isChecked(checkedMaakunnat, h),
          })),
          _fp.filter<Maakunta>((h) => h.isMaakunta),
        ])(searchHitsSijainnit),
      },
    ],
    [searchHitsSijainnit, selectedSijainnit, checkedMaakunnat, t]
  );

  // TODO: Use Filter.tsx if possible
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
                {firstFiveMaakunnat.map((maakuntaTuple) => {
                  const [id, data] = maakuntaTuple;
                  const labelId = `educationtype-outerlist-label-${id}`;
                  return (
                    <ListItem
                      key={id}
                      id={id}
                      dense
                      button
                      onClick={handleMaakuntaToggle(maakuntaTuple)}>
                      <ListItemIcon>
                        <SuodatinCheckbox
                          edge="start"
                          checked={checkedMaakunnat.some(
                            ({ id: checkedId }) => checkedId === id
                          )}
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
                            <Grid item>{l.localize(data)}</Grid>
                            <Grid item>{`(${data?.count})`}</Grid>
                          </Grid>
                        }
                      />
                    </ListItem>
                  );
                })}
                {showRest &&
                  restMaakunnat.map((maakuntaTuple) => {
                    const [id, data] = maakuntaTuple;
                    const labelId = `educationtype-outerlist-label-${id}`;
                    return (
                      <ListItem
                        key={id}
                        id={id}
                        dense
                        button
                        onClick={handleMaakuntaToggle(maakuntaTuple)}>
                        <ListItemIcon>
                          <SuodatinCheckbox
                            edge="start"
                            checked={checkedMaakunnat.some(
                              ({ id: checkedId }) => checkedId === id
                            )}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <SuodatinListItemText
                          id={labelId}
                          primary={
                            <Grid container justify="space-between" wrap="nowrap">
                              <Grid item>{l.localize(data)}</Grid>
                              <Grid item>{`(${data?.count})`}</Grid>
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
