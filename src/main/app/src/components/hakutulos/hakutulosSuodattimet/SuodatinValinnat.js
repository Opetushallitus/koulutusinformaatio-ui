import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Chip, Grid } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';
import { styles } from '../../../styles';
import { useStores } from '../../../hooks';
import { toJS } from 'mobx';
import _omit from 'lodash/omit';

const SuodatinValinnat = observer((props) => {
  const { classes, i18n, history, t } = props;
  const { hakuStore } = useStores();
  const { filter } = hakuStore;

  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilters(toJS(filter));
  }, [filter, props]);

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
      search: qs.stringify(_omit(search, Object.keys(filters))),
    });
    hakuStore.clearFilters();
  };

  const displayChips = (entry) => {
    return entry[1].map((item) => (
      <Chip
        size="small"
        key={`chip_${item.id}`}
        classes={{
          root: classes.hakuTulosChipRoot,
          label: classes.hakuTulosChipLabel,
        }}
        label={item?.name?.[i18n.language]}
        onDelete={handleDelete(entry[0], item)}
      />
    ));
  };

  return (
    <Grid container wrap="nowrap" justify="space-between">
      <Grid item>
        {Object.entries(filters).map((entry) =>
          entry[1].length > 0 ? displayChips(entry) : ''
        )}
      </Grid>
      <Grid item>
        <Button
          size="small"
          startIcon={<Clear />}
          classes={{
            label: classes.hakuTulosFiltersClearLabel,
            sizeSmall: classes.hakuTulosFiltersClearSizeSmall,
          }}
          onClick={() => handleClearFilters()}
        >
          {t('haku.poista-valitut-rajaimet')}
        </Button>
      </Grid>
    </Grid>
  );
});

const OpetusKieliSuodatinWithStyles = withTranslation()(
  withStyles(styles)(SuodatinValinnat)
);

export default withRouter(OpetusKieliSuodatinWithStyles);
