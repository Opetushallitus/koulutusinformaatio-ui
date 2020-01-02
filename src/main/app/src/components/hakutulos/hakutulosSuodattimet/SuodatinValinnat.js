import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Chip, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';
import { styles } from '../../../styles';
import { useStores } from '../../../hooks';
import { toJS } from 'mobx';

const SuodatinValinnat = observer((props) => {
  const { classes, i18n, history } = props;
  const { hakuStore } = useStores();
  const { filter } = hakuStore;

  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilters(toJS(filter));
  }, [filter, props]);

  const handleDelete = (filterType, item) => () => {
    const newFilters = { ...filters };

    newFilters[filterType] = newFilters[filterType].filter(
      (thisItem) => thisItem.id !== item.id
    );

    hakuStore.setFilters(filterType, item);
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
    setFilters(newFilters);
  };

  const displayChips = (entry) => {
    return entry[1].map((item) => (
      <Chip
        key={`chip_${item.id}`}
        label={item.name.fi}
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
      <Grid item style={{ minWidth: '142px' }}>
        Poista valitut rajaimet
      </Grid>
    </Grid>
  );
});

const OpetusKieliSuodatinWithStyles = withTranslation()(
  withStyles(styles)(SuodatinValinnat)
);

export default withRouter(OpetusKieliSuodatinWithStyles);
