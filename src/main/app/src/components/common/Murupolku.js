import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles, Box, Link } from '@material-ui/core';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import clsx from 'clsx';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import { colors } from '../../colors';

const useStyles = makeStyles((theme) => ({
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
    ...theme.typography.body1,
  },
  lastLink: {
    cursor: 'default',
    color: colors.green,
  },
}));

const Murupolku = ({ path }) => {
  const matches = useMediaQuery('(max-width: 900px)');
  const { t } = useTranslation();
  const classes = useStyles();
  const shownPath =
    matches && path.length !== 1
      ? path.length === 0
        ? []
        : [{ name: '...' }, path[path.length - 1]]
      : path.filter((p) => p.link);

  return (
    <ul className={clsx(classes.breadcrump)}>
      <li>
        <Link component={RouterLink} to={''} className={classes.link}>
          <HomeOutlinedIcon className={classes.home} />
          {t('etusivu')}
        </Link>
      </li>

      {shownPath.map(({ name, link }, ind) => {
        const isLast = shownPath.length - 1 === ind;
        return (
          <li key={`breadcrump-item-${ind}`}>
            <ArrowForwardIosIcon className={classes.arrow} />
            <Box component="span" ml={2}>
              <Link
                component={link ? RouterLink : 'span'}
                className={clsx(classes.link, {
                  [classes.lastLink]: isLast,
                })}
                to={link}
                underline={isLast ? 'none' : 'hover'}>
                {name}
              </Link>
            </Box>
          </li>
        );
      })}
    </ul>
  );
};

export default Murupolku;
