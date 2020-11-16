import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import LocalizedLink from '#/src/components/common/LocalizedLink';
import { colors } from '#/src/colors';

const useStyles = makeStyles((theme) => ({
  home: {
    display: 'inline',
    verticalAlign: 'text-bottom',
    marginRight: '10px',
    fontSize: '22px',
  },
  arrow: {
    display: 'inline',
    color: colors.lightGrey,
    marginLeft: '18px',
    marginRight: '18px',
    fontSize: '12px',
  },
  mobileItemWrapper: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${colors.lightGrey}`,
  },
  link: ({ isLast, link }) => ({
    ...theme.typography.body1,
    display: 'inline',
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
    ...(link != null && {
      cursor: 'pointer',
    }),
    ...(isLast && {
      cursor: 'pointer',
      fontWeight: 600,
      color: colors.green,
    }),
  }),
}));

export const MurupolkuFragment = (props) => {
  const {
    link,
    name,
    isLast,
    openDrawer,
    closeDrawer = () => {},
    isCollapsedPart,
    isHome,
  } = props;
  const classes = useStyles(props);

  return (
    <span>
      {!isHome ? (
        <ArrowForwardIosIcon aria-hidden="true" className={classes.arrow} />
      ) : (
        ''
      )}
      <LocalizedLink
        {...(link
          ? {
              component: RouterLink,
              to: link,
            }
          : {
              href: isLast ? window.location.href : undefined,
            })}
        role={isCollapsedPart ? 'button' : 'link'}
        className={classes.link}
        onClick={() => {
          if (isCollapsedPart) {
            openDrawer();
          } else if (link) {
            closeDrawer();
          }
        }}
        aria-current={isLast ? 'location' : undefined}>
        {isHome ? <HomeOutlinedIcon aria-hidden="true" className={classes.home} /> : ''}

        {name}
      </LocalizedLink>
    </span>
  );
};
