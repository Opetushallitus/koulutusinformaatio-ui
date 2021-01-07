import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, makeStyles } from '@material-ui/core';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import LocalizedLink from '#/src/components/common/LocalizedLink';
import { colors } from '#/src/colors';

const BREADCRUMB_ICON_SPACING = '14px';

const useStyles = makeStyles((theme) => ({
  home: {
    display: 'inline',
    marginRight: BREADCRUMB_ICON_SPACING,
    verticalAlign: 'text-bottom',
    fontSize: '22px',
  },
  arrow: {
    display: 'inline',
    marginRight: BREADCRUMB_ICON_SPACING,
    color: colors.lightGrey,
    fontSize: '12px',
  },
  link: ({ isLast, isHome, link }) => ({
    ...theme.typography.body1,
    marginRight: BREADCRUMB_ICON_SPACING,
    display: 'inline',
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
    ...(link
      ? {
          cursor: 'pointer',
          color: colors.brandGreen,
        }
      : {}),
    ...(isLast && !isHome
      ? {
          color: theme.palette.text.primary,
          pointerEvents: 'none',
          fontWeight: 600,
        }
      : {}),
  }),
  collapsedPart: {
    ...theme.typography.body1,
    marginRight: BREADCRUMB_ICON_SPACING,
    cursor: 'pointer',
    border: `1px solid ${colors.lightGrey}`,
    padding: '2px 12px',
    lineHeight: '24px',
    minWidth: 0,
    '&:hover, &:active': {
      borderColor: colors.brandGreen,
    },
  },
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
      {!isHome && <ArrowForwardIosIcon aria-hidden="true" className={classes.arrow} />}
      {isCollapsedPart ? (
        <Button className={classes.collapsedPart} onClick={openDrawer}>
          {name}
        </Button>
      ) : (
        <LocalizedLink
          {...(link
            ? {
                component: RouterLink,
                to: link,
              }
            : {
                href: isLast ? window.location.href : undefined,
              })}
          className={classes.link}
          onClick={closeDrawer}
          aria-current={isLast ? 'location' : undefined}>
          {isHome && <HomeOutlinedIcon aria-hidden="true" className={classes.home} />}
          {name}
        </LocalizedLink>
      )}
    </span>
  );
};
