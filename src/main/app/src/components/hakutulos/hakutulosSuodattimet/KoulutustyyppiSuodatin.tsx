import React, { useMemo, useState } from 'react';

import { Button, ButtonGroup, Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '#/src/colors';
import { handleFiltersChange, newSearchAll } from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterValue, SuodatinComponentProps } from './SuodatinTypes';
import { flattenCheckboxValues, getFilterStateChanges } from './utils';

const withStyles = makeStyles(() => ({
  noBoxShadow: {
    boxShadow: 'none',
  },
  buttonRoot: {
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  buttonActive: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },
  buttonInactive: {
    backgroundColor: colors.white,
    color: colors.brandGreen,
  },
}));

const KOULUTUSTYYPPI_FILTER_ID = 'koulutustyyppi';
const KOULUTUSTYYPPI_MUU_FILTER_ID = 'koulutustyyppi-muu';
const koulutusSelector = getFilterProps(KOULUTUSTYYPPI_FILTER_ID);
const koulutusMuuSelector = getFilterProps(KOULUTUSTYYPPI_MUU_FILTER_ID);

export const KoulutustyyppiSuodatin = (props: SuodatinComponentProps) => {
  const classes = withStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isMuuSelected, setIsMuuSelected] = useState(false);
  const { values, localizedCheckedValues } = useSelector<any, FilterProps>(
    koulutusSelector
  );
  const {
    values: muuValues,
    localizedCheckedValues: muuLocalizedCheckedValues,
  } = useSelector<any, FilterProps>(koulutusMuuSelector);

  const filterValues = useMemo(
    () =>
      flattenCheckboxValues(isMuuSelected ? muuValues : values).map((v) => ({
        ...v,
        nimi: v.nimi || t(`haku.${v.id}`), // Kaikille koulutustyypeille ei tule backendista käännöksiä
      })),
    [isMuuSelected, muuValues, values, t]
  );

  const handleCheck = (item: FilterValue) => {
    const operations = getFilterStateChanges(isMuuSelected ? muuValues : values)(item);
    dispatch(handleFiltersChange(operations));
    dispatch(newSearchAll());
  };

  const usedCheckedStr = isMuuSelected
    ? muuLocalizedCheckedValues
    : localizedCheckedValues;

  return (
    <Filter
      {...props}
      testId="koulutustyyppi-filter"
      name={t('haku.koulutustyyppi')}
      values={filterValues}
      handleCheck={handleCheck}
      checkedStr={usedCheckedStr}
      additionalContent={
        <Grid item xs={12} style={{ padding: '20px 0' }}>
          <ButtonGroup fullWidth>
            <Button
              style={{ minWidth: '155px' }}
              className={!isMuuSelected ? classes.buttonActive : classes.buttonInactive}
              classes={{ root: classes.buttonRoot }}
              aria-selected={!isMuuSelected}
              onClick={() => setIsMuuSelected(false)}>
              {t('haku.tutkintoon-johtavat')}
            </Button>
            <Button
              className={isMuuSelected ? classes.buttonActive : classes.buttonInactive}
              classes={{ root: classes.buttonRoot }}
              aria-selected={isMuuSelected}
              onClick={() => setIsMuuSelected(true)}>
              {t('haku.muut')}
            </Button>
          </ButtonGroup>
        </Grid>
      }
    />
  );
};
