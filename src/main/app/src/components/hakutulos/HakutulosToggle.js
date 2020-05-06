import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedTab } from '#/src/store/reducers/hakutulosSlice';
import { useHistory } from 'react-router-dom';
import { Tabs, Tab, makeStyles, useMediaQuery } from '@material-ui/core';
import { SchoolOutlined, HomeWorkOutlined } from '@material-ui/icons';
import qs from 'query-string';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { MUI_BREAKPOINTS } from '../../constants';

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

const HakutulosToggle = ({ selectedTab, koulutusTotal, oppilaitosTotal }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const muiScreenSizeMinMd = useMediaQuery(MUI_BREAKPOINTS.MIN_MD);

  const [_selectedTab, _setSelectedTab] = useState(0);

  useEffect(() => {
    const tab = selectedTab === 'koulutus' ? 0 : 1;
    _setSelectedTab(tab);
  }, [selectedTab]);

  const handleSelectedTab = (event, newValue) => {
    _setSelectedTab(newValue);
    const search = qs.parse(history.location.search);
    const tabValue = newValue === 0 ? 'koulutus' : 'oppilaitos';
    const newSelectedTab = newValue === 0 ? 'koulutus' : 'oppilaitos';
    search.tab = tabValue;
    history.replace({ search: qs.stringify(search) });
    dispatch(setSelectedTab({ newSelectedTab }));
  };

  return (
    <Tabs
      variant={muiScreenSizeMinMd ? 'standard' : 'fullWidth'}
      value={_selectedTab}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleSelectedTab}>
      <Tab
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
