import React, { useCallback } from 'react';

import { CssBaseline, makeStyles } from '@material-ui/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@material-ui/icons';
import MuiFlatPagination from 'material-ui-flat-pagination';

import { usePaginatedTarjonta } from './hooks';

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

export const TarjontaPagination = ({ total, oid, isOppilaitosOsa }: Props) => {
  const classes = useStyles();

  const {
    pagination: { size, offset },
    setPagination,
  } = usePaginatedTarjonta({
    oid,
    isOppilaitosOsa,
    isTuleva: false,
  });

  const handleClick = useCallback(
    (e, offset, page) => {
      setPagination({
        page,
        offset,
      });
    },
    [setPagination]
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
