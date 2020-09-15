import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MuiFlatPagination from 'material-ui-flat-pagination';
import { CssBaseline, makeStyles } from '@material-ui/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@material-ui/icons';
import { getTarjontaPaginationProps } from '#/src/store/reducers/oppilaitosSliceSelector';
import { fetchTarjontaData } from '#/src/store/reducers/oppilaitosSlice';

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

const TarjontaPagination = ({ total, oid, isOppilaitosOsa }) => {
  const classes = useStyles();
  const { size, offset, order } = useSelector(getTarjontaPaginationProps);
  const dispatch = useDispatch();

  const handleClick = useCallback(
    (e, offset, page) => {
      dispatch(
        fetchTarjontaData({
          oid,
          requestParams: { page, size, order, offset },
          isOppilaitosOsa,
        })
      );
    },
    [dispatch, oid, order, size, isOppilaitosOsa]
  );

  return (
    total > size && (
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <CssBaseline />
        <MuiFlatPagination
          limit={size}
          offset={offset}
          total={total}
          onClick={handleClick}
          classes={classes}
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

export default TarjontaPagination;
