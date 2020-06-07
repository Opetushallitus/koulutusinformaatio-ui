import React, { useEffect } from 'react';
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

const TarjontaPagination = ({ total, oid }) => {
  const classes = useStyles();
  const { page, size, offset, order } = useSelector(getTarjontaPaginationProps);
  const dispatch = useDispatch();

  useEffect(() => {}, [page, size, offset, order]);

  const handleClick = (e, offset, page) => {
    dispatch(
      fetchTarjontaData({
        oid,
        requestParams: { page, size, order, offset },
      })
    );
  };

  return (
    total > size && (
      <div style={{ textAlign: 'center', marginTop: 30 }}>
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

export default TarjontaPagination;
