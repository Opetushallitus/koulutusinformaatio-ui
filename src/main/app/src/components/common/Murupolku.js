import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles, Box } from '@material-ui/core';
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
    verticalAlign: 'text-bottom',
    marginRight: '10px',
    fontSize: '22px',
  },
  arrow: {
    display: 'inline-flex',
    color: colors.lightGrey,
    marginLeft: '18px',
    fontSize: '12px',
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
        <Box component="span" ml={2}>
          <Link href={`/konfo/`} className={clsx(classes.link)}>
            {t('etusivu')}
          </Link>
        </Box>
      </li>

      {shownPath.map(({ name, link }, ind) => (
        <li key={`breadcrump-item-${ind}`}>
          <ArrowForwardIosIcon className={classes.arrow} />
          {ind === shownPath.length - 1 && link ? (
            <Box component="span" ml={2}>
              <Link className={clsx(classes.link)} href={`/konfo${link}`}>
                {name}
              </Link>
            </Box>
          ) : (
            <Box component="span" ml={2}>
              {name}
            </Box>
          )}
        </li>
      ))}
    </ul>
  );
};

export default withRouter(Murupolku);
