import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import Link from '@material-ui/core/Link';
import clsx from 'clsx';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import { colors } from '../../colors';

const useStyles = makeStyles({
  breadcrump: {
    marginLeft: '0',
    paddingLeft: '0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    justifyItems: 'flex-start',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    listStyle: 'none',
  },
  home: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    marginRight: '10px',
    fontSize: '22px',
  },
  arrow: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    color: colors.lightGrey,
    marginRight: '10px',
    marginLeft: '10px',
    fontSize: '12px',
  },
  item: {
    display: 'inline-flex',
    fontWeight: '400',
    verticalAlign: 'sub',
    color: colors.grey,
  },
  link: {
    color: colors.green,
  },
});

const Murupolku = ({ path, history }) => {
  const matches = useMediaQuery('(max-width: 900px)');
  const { t } = useTranslation();
  const classes = useStyles();
  const forwardToPage = (path) => {
    history.push(path);
  };
  const shownPath =
    matches && path.length !== 1
      ? path.length === 0
        ? []
        : [{ name: '...' }, path[path.length - 1]]
      : path;

  return (
    <ul className={clsx(classes.breadcrump)}>
      <li>
        <HomeOutlinedIcon className={classes.home} />
        <Link
          onClick={() => forwardToPage('/')}
          className={clsx(classes.item, classes.link)}
        >
          {t('etusivu')}
        </Link>
      </li>

      {shownPath.map(({ name, link }, ind) => (
        <li key={`breadcrump-item-${ind}`}>
          <ArrowForwardIosIcon className={classes.arrow} />
          {ind === shownPath.length - 1 ? (
            <Link
              className={clsx(classes.item, classes.link)}
              onClick={() => forwardToPage(link)}
            >
              {name}
            </Link>
          ) : (
            <span className={classes.item}>{name}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default withRouter(Murupolku);
