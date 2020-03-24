import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import qs from 'query-string';

const useStyles = makeStyles({
  draft: {
    display: 'inline-block',
    position: 'fixed',
    top: '10px',
    left: '-35px',
    width: '120px',
    padding: '5px',
    zIndex: '100000',
    fontSize: '12px',
    textAlign: 'center',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(229, 57, 53)',
    boxShadow: 'rgba(0, 0, 0, 0.176) 0px 6px 12px',
    transform: 'rotate(-45deg)',
  },
});

const Draft = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const { draft } = qs.parse(history.location.search);
  return draft ? <div className={classes.draft}>{t('Esikatselu')}</div> : null;
};

export default Draft;
