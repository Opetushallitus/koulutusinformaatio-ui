import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { CssBaseline, makeStyles } from '@material-ui/core';
import MuiFlatPagination from 'material-ui-flat-pagination';
import qs from 'query-string';
import { useStores } from '../../hooks';

const useStyles = makeStyles((theme) => ({
  paginationRootCurrent: {
    fontWeight: 'bold',
  },
}));

const Pagination = observer(({ history }) => {
  const classes = useStyles();
  const { hakuStore } = useStores();

  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(10);

  useEffect(() => {
    setTotal(
      hakuStore.toggle === 'koulutus'
        ? hakuStore.koulutusTotal
        : hakuStore.oppilaitosTotal
    );
    setOffset(
      hakuStore.toggle === 'koulutus'
        ? hakuStore.koulutusOffset
        : hakuStore.oppilaitosOffset
    );
  }, [
    hakuStore.koulutusOffset,
    hakuStore.oppilaitosOffset,
    hakuStore.koulutusTotal,
    hakuStore.oppilaitosTotal,
    hakuStore.toggle,
  ]);

  const handleClick = (e, offset, page) => {
    const search = qs.parse(history.location.search);

    setOffset(offset);
    if (hakuStore.toggle === 'koulutus') {
      search.kpage = page;
      history.replace({ search: qs.stringify(search) });
      hakuStore.setKoulutusOffset(offset);
      hakuStore.setPagingPageKoulutus(page);
      hakuStore.searchKoulutukset();
    } else {
      search.opage = page;
      history.replace({ search: qs.stringify(search) });
      hakuStore.setOppilaitosOffset(offset);
      hakuStore.setPagingPageOppilaitos(page);
      hakuStore.searchOppilaitokset();
    }
  };

  return (
    total > hakuStore.paging.pageSize && (
      <React.Fragment>
        <CssBaseline />
        <MuiFlatPagination
          limit={hakuStore.paging.pageSize}
          offset={offset}
          total={total}
          onClick={(e, offset, page) => handleClick(e, offset, page)}
          classes={{ rootCurrent: classes.paginationRootCurrent }}
        />
      </React.Fragment>
    )
  );
});

export default withRouter(Pagination);
