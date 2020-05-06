import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import qs from 'query-string';
import MuiFlatPagination from 'material-ui-flat-pagination';
import { CssBaseline, makeStyles } from '@material-ui/core';
import {
  getHakutulosPagination,
  getAPIRequestParams,
} from '#/src/store/reducers/hakutulosSliceSelector';
import {
  setKoulutusOffsetAndPage,
  searchKoulutukset,
  searchOppilaitokset,
  setOppilaitosOffsetAndPage,
} from '#/src/store/reducers/hakutulosSlice';

const useStyles = makeStyles((theme) => ({
  paginationRootCurrent: {
    fontWeight: 'bold',
  },
}));

const Pagination = ({ size }) => {
  const history = useHistory();
  const classes = useStyles();

  const paginationProps = useSelector(getHakutulosPagination);
  const apiRequestParams = useSelector(getAPIRequestParams);
  const dispatch = useDispatch();

  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(10);

  useEffect(() => {
    setTotal(
      paginationProps.selectedTab === 'koulutus'
        ? paginationProps.koulutusTotal
        : paginationProps.oppilaitosTotal
    );
    setOffset(
      paginationProps.selectedTab === 'koulutus'
        ? paginationProps.koulutusOffset
        : paginationProps.oppilaitosOffset
    );
  }, [paginationProps]);

  const handleClick = (e, offset, page) => {
    const search = qs.parse(history.location.search);

    setOffset(offset);
    if (paginationProps.selectedTab === 'koulutus') {
      search.kpage = page;
      history.replace({ search: qs.stringify(search) });
      dispatch(setKoulutusOffsetAndPage({ koulutusOffset: offset, koulutusPage: page }));
      dispatch(searchKoulutukset({ ...apiRequestParams, page, size }));
    } else {
      search.opage = page;
      history.replace({ search: qs.stringify(search) });
      dispatch(
        setOppilaitosOffsetAndPage({ oppilaitosOffset: offset, oppilaitosPage: page })
      );
      dispatch(searchOppilaitokset({ ...apiRequestParams, page, size }));
    }
  };

  return (
    total > size && (
      <div style={{ textAlign: 'center' }}>
        <CssBaseline />
        <MuiFlatPagination
          limit={size}
          offset={offset}
          total={total}
          onClick={(e, offset, page) => handleClick(e, offset, page)}
          classes={{ rootCurrent: classes.paginationRootCurrent }}
        />
      </div>
    )
  );
};

export default Pagination;
