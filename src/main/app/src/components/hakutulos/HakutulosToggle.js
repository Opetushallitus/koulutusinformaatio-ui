import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { Tabs, Tab, makeStyles, useMediaQuery } from '@material-ui/core';
import { SchoolOutlined, HomeWorkOutlined } from '@material-ui/icons';
import qs from 'query-string';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks';
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

const HakutulosToggle = observer(() => {
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const { hakuStore } = useStores();
  const muiScreenSizeMinMd = useMediaQuery(MUI_BREAKPOINTS.MIN_MD);

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const tab = hakuStore.toggle === 'koulutus' ? 0 : 1;
    setSelectedTab(tab);
  }, [hakuStore.toggle]);

  const handleSelectedTab = (event, newValue) => {
    setSelectedTab(newValue);
    const search = qs.parse(history.location.search);
    const toggleValue = newValue === 0 ? 'koulutus' : 'oppilaitos';
    search.toggle = toggleValue;
    hakuStore.setToggle(toggleValue);
    history.replace({ search: qs.stringify(search) });
  };

  return (
    <Tabs
      variant={muiScreenSizeMinMd ? 'standard' : 'fullWidth'}
      value={selectedTab}
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
          _.isNil(hakuStore.koulutusTotal) ? ' ' : hakuStore.koulutusTotal
        })`}></Tab>
      <Tab
        icon={<HomeWorkOutlined className={classes.tabIconMargin} />}
        classes={{
          wrapper: classes.tabWrapper,
          labelIcon: classes.tabLabelIcon,
          root: classes.tabRoot,
        }}
        label={`${t('haku.oppilaitokset')} (${
          _.isNil(hakuStore.oppilaitosTotal) ? '' : hakuStore.oppilaitosTotal
        })`}></Tab>
    </Tabs>
  );
});

export default HakutulosToggle;
