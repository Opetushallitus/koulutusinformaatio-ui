import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MuiFlatPagination from 'material-ui-flat-pagination';
import { CssBaseline, makeStyles } from '@material-ui/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@material-ui/icons';
import { getTulevaTarjontaPaginationProps } from '#/src/store/reducers/oppilaitosSliceSelector';
import { fetchTulevaTarjontaData } from '#/src/store/reducers/oppilaitosSlice';

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

const TarjontaPagination = ({ total, oid }) => {
  const classes = useStyles();

  const { size, offset, order } = useSelector(getTulevaTarjontaPaginationProps);
  const dispatch = useDispatch();

  const handleClick = useCallback(
    (e, offset, page) => {
      dispatch(
        fetchTulevaTarjontaData({
          oid,
          requestParams: { page, size, order, offset },
        })
      );
    },
    [dispatch, oid, order, size]
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
