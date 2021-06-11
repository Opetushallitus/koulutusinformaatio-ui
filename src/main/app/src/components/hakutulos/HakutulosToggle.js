import React from 'react';

import { Tabs, Tab, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { SchoolOutlined, HomeWorkOutlined } from '@material-ui/icons';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { setSelectedTab } from '#/src/store/reducers/hakutulosSlice';
import { getHakutulosToggleProps } from '#/src/store/reducers/hakutulosSliceSelector';

const useStyles = makeStyles((theme) => ({
  tabIconMargin: {
    marginBottom: '0 !important',
    marginRight: theme.spacing(2),
  },
  tabWrapper: {
    flexDirection: 'row',
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  tabLabelIcon: {
    minHeight: '50px',
    paddingLeft: 0,
    paddingRight: theme.spacing(3),
  },
  tabRoot: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '0.9rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1rem',
    },
  },
}));

const HakutulosToggle = () => {
  const { t } = useTranslation();
  const { selectedTab, koulutusTotal, oppilaitosTotal } = useSelector(
    getHakutulosToggleProps
  );
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const muiScreenSizeMinMd = useMediaQuery(theme.breakpoints.up('md'));

  const handleSelectedTab = (e, newSelectedTab) => {
    dispatch(setSelectedTab({ newSelectedTab }));
  };

  return (
    <Tabs
      variant={muiScreenSizeMinMd ? 'standard' : 'fullWidth'}
      value={selectedTab}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleSelectedTab}>
      <Tab
        value="koulutus"
        icon={<SchoolOutlined className={classes.tabIconMargin} />}
        classes={{
          wrapper: classes.tabWrapper,
          labelIcon: classes.tabLabelIcon,
          root: classes.tabRoot,
        }}
        label={`${t('haku.koulutukset')} (${
          _.isNil(koulutusTotal) ? 0 : koulutusTotal
        })`}></Tab>
      <Tab
        value="oppilaitos"
        icon={<HomeWorkOutlined className={classes.tabIconMargin} />}
        classes={{
          wrapper: classes.tabWrapper,
          labelIcon: classes.tabLabelIcon,
          root: classes.tabRoot,
        }}
        label={`${t('haku.oppilaitokset')} (${
          _.isNil(oppilaitosTotal) ? 0 : oppilaitosTotal
        })`}></Tab>
    </Tabs>
  );
};

export default HakutulosToggle;
