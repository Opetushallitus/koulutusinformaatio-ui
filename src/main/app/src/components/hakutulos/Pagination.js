import React, { useEffect, useState } from 'react';

import { CssBaseline, makeStyles } from '@material-ui/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@material-ui/icons';
import MuiFlatPagination from 'material-ui-flat-pagination';
import { useSelector, useDispatch } from 'react-redux';

import { useQueryParams } from '#/src/hooks';
import {
  searchKoulutukset,
  searchOppilaitokset,
} from '#/src/store/reducers/hakutulosSlice';
import { getHakutulosPagination } from '#/src/store/reducers/hakutulosSliceSelector';

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
    setOffset(offset);
    if (paginationProps.selectedTab === 'koulutus') {
      dispatch(
        searchKoulutukset({
          requestParams: { ...apiRequestParams, page, size },
          koulutusOffset: offset,
          koulutusPage: page,
        })
      );
    } else {
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
