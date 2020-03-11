import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Chip, Grid, makeStyles } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../hooks';
import { toJS } from 'mobx';
import _ from 'lodash';

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

const SuodatinValinnat = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const classes = useStyles();
  const { hakuStore } = useStores();
  const { filter } = hakuStore;

  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilters(toJS(filter));
  }, [filter, location]);

  const handleDelete = (filterType, item) => () => {
    const search = qs.parse(history.location.search);
    const _filterType =
      filterType !== 'selectedsijainnit' ? filterType : 'sijainti';
    const newFilters = { ...filters };

    newFilters[filterType] = newFilters[filterType].filter(
      ({ id }) => id !== item.id
    );

    search[_filterType] = newFilters[filterType]
      .filter(({ id }) => id !== item.id)
      .map(({ id }) => id)
      .join(',');

    if (!search[_filterType] || search[_filterType].length === 0) {
      delete search[_filterType];
    }

    history.replace({ search: qs.stringify(search) });
    hakuStore.setFilters(filterType, item);
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    const search = qs.parse(history.location.search);

    history.replace({
      search: qs.stringify(_.omit(search, Object.keys(filters))),
    });
    hakuStore.clearFilters();
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
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
});

export default SuodatinValinnat;
