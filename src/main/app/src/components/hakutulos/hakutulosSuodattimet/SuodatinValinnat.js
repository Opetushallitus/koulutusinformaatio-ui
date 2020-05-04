import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Grid, makeStyles } from '@material-ui/core';
import qs from 'query-string';
import _ from 'lodash';
import { Clear } from '@material-ui/icons';
import {
  getSuodatinValinnatProps,
  getAPIRequestParams,
} from '#/src/reducers/hakutulosSliceSelector';
import {
  clearSelectedFilters,
  searchAll,
  setSelectedFilters,
} from '#/src/reducers/hakutulosSlice';
import { Common as C } from '#/src/tools/Utils';

const useStyles = makeStyles((theme) => ({
  chipRoot: {
    marginBottom: 5,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: '#F7F7F7',
    border: 'none',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: 600,
  },
  clearButtonLabel: {
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'underline',
    whiteSpace: 'nowrap',
  },
  clearButtonSizeSmall: {
    padding: '1px 5px',
  },
}));

const SuodatinValinnat = () => {
  const history = useHistory();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const suodatinValinnatProps = useSelector(getSuodatinValinnatProps);
  const apiRequestParams = useSelector(getAPIRequestParams);

  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilters(suodatinValinnatProps);
  }, [suodatinValinnatProps, location]);

  const handleDelete = (filterType, item) => () => {
    const search = qs.parse(history.location.search);

    const newFilterValuesStr = filters[filterType]
      .filter(({ id }) => id !== item.id)
      .map(({ id }) => id)
      .join(',');

    search[filterType] = newFilterValuesStr;
    history.replace({ search: qs.stringify(C.withoutNilValues(search)) });
    dispatch(setSelectedFilters({ filterType: filterType, itemId: item?.id }));
    dispatch(searchAll({ ...apiRequestParams, [filterType]: newFilterValuesStr }));
  };

  const handleClearFilters = () => {
    const search = qs.parse(history.location.search);

    history.replace({
      search: qs.stringify(_.omit(search, _.keys(filters))),
    });
    dispatch(clearSelectedFilters());
    dispatch(searchAll(_.omit(apiRequestParams, _.keys(filters))));
  };

  const displayChips = (entry) => {
    return entry[1].map((item) => (
      <Chip
        size="small"
        key={`chip_${item.id}`}
        classes={{
          root: classes.chipRoot,
          label: classes.chipLabel,
        }}
        label={item?.name?.[i18n.language]}
        onDelete={handleDelete(entry[0], item)}
      />
    ));
  };

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      style={{ paddingBottom: '5px' }}>
      <Grid item style={{ paddingTop: '5px' }}>
        {Object.entries(filters).map((entry) =>
          entry[1].length > 0 ? displayChips(entry) : ''
        )}
      </Grid>
      <Grid item>
        <Button
          size="small"
          startIcon={<Clear />}
          classes={{
            label: classes.clearButtonLabel,
            sizeSmall: classes.clearButtonSizeSmall,
          }}
          onClick={() => handleClearFilters()}>
          {t('haku.poista-valitut-rajaimet')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default SuodatinValinnat;
