import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import Link from '@material-ui/core/Link';
import clsx from 'clsx';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import { colors } from '../../colors';

const useStyles = makeStyles({
  breadcrump: {
    height: '20px',
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  forwardIcon: {
    color: colors.lightGrey,
    marginRight: '10px',
    marginLeft: '10px',
  },
  icon: {
    marginRight: '10px',
  },
  link: {
    fontWeight: '400',
    maxWidth: '250px',
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    verticalAlign: 'top',
    color: colors.grey,
  },
  lastLink: {
    color: colors.green,
  },
});

const Murupolku = ({ path, history }) => {
  const matches = useMediaQuery('(max-width: 900px)');
  const { t } = useTranslation();
  const classes = useStyles();
  const forwardToFrontPage = (path) => {
    history.push(path);
  };
  const shownPath = matches
    ? path.length === 0
      ? []
      : [path[path.length - 1]]
    : path;
  return (
    <div className={classes.breadcrump}>
      <Icon className={classes.icon}>
        <HomeOutlinedIcon />
      </Icon>
      <Link onClick={() => forwardToFrontPage('/')} className={classes.link}>
        {t('etusivu')}
      </Link>
      {shownPath.map(({ name, link, ...currentLink }, ind) => {
        const arrow = (
          <ArrowForwardIosIcon
            style={{ fontSize: '12px', height: '20px' }}
            key={`breadcrumpseparator-${ind}`}
            className={classes.forwardIcon}
          />
        );

        return (matches
          ? [arrow, <span className={classes.link}>...</span>, arrow]
          : [arrow]
        ).concat([
          link ? (
            <Link
              key={`breadcrumplink-${ind}`}
              className={clsx(
                classes.link,
                ind === path.length - 1 && classes.lastLink
              )}
              to={link}
            >
              {name}
            </Link>
          ) : (
            <span key={`breadcrumplink-${ind}`} className={clsx(classes.link)}>
              {name}
            </span>
          ),
        ]);
      })}
    </div>
  );
};

export default withRouter(Murupolku);
