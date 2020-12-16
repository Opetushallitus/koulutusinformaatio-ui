import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import qs from 'query-string';
import MuiFlatPagination from 'material-ui-flat-pagination';
import { CssBaseline, makeStyles } from '@material-ui/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@material-ui/icons';

import { getHakutulosPagination } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  searchKoulutukset,
  searchOppilaitokset,
} from '#/src/store/reducers/hakutulosSlice';
import { useQueryParams } from '#/src/hooks';

const useStyles = makeStyles((theme) => ({
  sizeSmall: {
    padding: '1px 6px',
    margin: '0 4px',
  },
  rootCurrent: {
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'green',
    },
  },
  textPrimary: {
    color: 'white',
  },
  textSecondary: {
    color: 'black',
  },
  text: {
    fontWeight: 'bold',
  },
}));

const Pagination = ({ size }) => {
  const history = useHistory();
  const classes = useStyles();

  const paginationProps = useSelector(getHakutulosPagination);
  const apiRequestParams = useQueryParams();
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
      dispatch(
        searchKoulutukset({
          requestParams: { ...apiRequestParams, page, size },
          koulutusOffset: offset,
          koulutusPage: page,
        })
      );
    } else {
      search.opage = page;
      history.replace({ search: qs.stringify(search) });
      dispatch(
        searchOppilaitokset({
          requestParams: { ...apiRequestParams, page, size },
          oppilaitosOffset: offset,
          oppilaitosPage: page,
        })
      );
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
          classes={{
            root: classes.root,
            rootCurrent: classes.rootCurrent,
            text: classes.text,
            textPrimary: classes.textPrimary,
            textSecondary: classes.textSecondary,
            sizeSmall: classes.sizeSmall,
            label: classes.label,
          }}
          otherPageColor="secondary"
          currentPageColor="primary"
          size="small"
          previousPageLabel={<ChevronLeftOutlined />}
          nextPageLabel={<ChevronRightOutlined />}
        />
      </div>
    )
  );
};

export default Pagination;
