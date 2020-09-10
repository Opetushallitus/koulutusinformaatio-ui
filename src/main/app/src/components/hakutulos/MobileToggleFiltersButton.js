import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { FilterList } from '@material-ui/icons';
import { Badge, Button, ButtonGroup, Hidden, makeStyles } from '@material-ui/core';
import { colors } from '#/src/colors';
import {
  toggleshowHakutulosFilters,
  executeSearchFromStartingPage,
} from '#/src/store/reducers/hakutulosSlice';
import { getSuodatinValinnatProps } from '#/src/store/reducers/hakutulosSliceSelector';
import { getAPIRequestParams } from '#/src/store/reducers/hakutulosSliceSelector';

const useStyles = makeStyles((theme) => ({
  buttonGroupRoot: {
    position: 'fixed',
    zIndex: 1,
    bottom: 30,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: colors.green,
  },
  navActionRoot: {
    color: colors.white,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

const MobileToggleFiltersButton = ({ isFrontPage = false }) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const suodatinValinnatProps = useSelector(getSuodatinValinnatProps);
  const apiRequestParams = useSelector(getAPIRequestParams);
  const {
    showHakutulosFilters,
    koulutusTotal,
    oppilaitosTotal,
    selectedTab,
  } = useSelector(
    (state) => ({
      showHakutulosFilters: state.hakutulos.showHakutulosFilters,
      koulutusTotal: state.hakutulos.koulutusTotal,
      oppilaitosTotal: state.hakutulos.oppilaitosTotal,
      selectedTab: state.hakutulos.selectedTab,
    }),
    shallowEqual
  );

  const handleFiltersShowToggle = () => {
    isFrontPage && dispatch(executeSearchFromStartingPage({ apiRequestParams, history }));
    dispatch(toggleshowHakutulosFilters());
  };

  const buttonText = () =>
    selectedTab === 'koulutus'
      ? t('haku.nayta-hakutulos', { count: koulutusTotal })
      : t('haku.nayta-hakutulos', { count: oppilaitosTotal });

  return (
    <Hidden mdUp>
      <ButtonGroup classes={{ root: classes.buttonGroupRoot }}>
        {showHakutulosFilters ? (
          <Button
            classes={{
              root: classes.buttonRoot,
              label: classes.buttonLabel,
            }}
            onClick={handleFiltersShowToggle}>
            {buttonText()}
          </Button>
        ) : (
          <Button
            endIcon={
              <Badge
                color="error"
                badgeContent={_.sumBy(_.values(suodatinValinnatProps), (arr) =>
                  _.size(arr)
                )}>
                <FilterList />
              </Badge>
            }
            classes={{
              root: classes.buttonRoot,
              label: classes.buttonLabel,
            }}
            onClick={handleFiltersShowToggle}>
            {t('haku.rajaa-tuloksia')}
          </Button>
        )}
      </ButtonGroup>
    </Hidden>
  );
};

export default MobileToggleFiltersButton;
