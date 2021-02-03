import { CssBaseline, makeStyles } from '@material-ui/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@material-ui/icons';
import MuiFlatPagination from 'material-ui-flat-pagination';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTulevaTarjontaData } from '#/src/store/reducers/oppilaitosSlice';
import { getTulevaTarjontaPaginationProps } from '#/src/store/reducers/oppilaitosSliceSelector';

const useStyles = makeStyles(() => ({
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

type Props = {
  total: number;
  oid: string;
  isOppilaitosOsa: boolean;
};

export const TulevaTarjontaPagination = ({ total, oid, isOppilaitosOsa }: Props) => {
  const classes = useStyles();

  const { size, offset, order } = useSelector(getTulevaTarjontaPaginationProps);
  const dispatch = useDispatch();

  const handleClick = useCallback(
    (ignored, offset, page) => {
      dispatch(
        fetchTulevaTarjontaData({
          oid,
          requestParams: { page, size, order, offset },
          isOppilaitosOsa,
        })
      );
    },
    [dispatch, oid, order, size, isOppilaitosOsa]
  );

  return total > size ? (
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
  ) : null;
};
