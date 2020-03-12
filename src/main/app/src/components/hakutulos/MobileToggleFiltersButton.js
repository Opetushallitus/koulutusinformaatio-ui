import React from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { FilterList } from '@material-ui/icons';
import {
  Badge,
  Button,
  ButtonGroup,
  Hidden,
  makeStyles,
} from '@material-ui/core';
import { useStores } from '../../hooks';
import { colors } from '../../colors';

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

const MobileToggleFiltersButton = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { hakuStore } = useStores();

  const handleFiltersShowToggle = () => {
    hakuStore.toggleHakutulosFitersHidden();
  };

  const buttonText = () => {
    if (hakuStore.toggle === 'koulutus') {
      switch (hakuStore.koulutusTotal) {
        case 1:
          return t('haku.nayta_0_hakutulos', {
            total: hakuStore.koulutusTotal,
          });
        default:
          return t('haku.nayta_0_hakutulosta', {
            total: hakuStore.koulutusTotal,
          });
      }
    }
    switch (hakuStore.oppilaitosTotal) {
      case 1:
        return t('haku.nayta_0_hakutulos', {
          total: hakuStore.oppilaitosTotal,
        });
      default:
        return t('haku.nayta_0_hakutulosta', {
          total: hakuStore.oppilaitosTotal,
        });
    }
  };

  console.log();

  return (
    <Hidden mdUp>
      <ButtonGroup classes={{ root: classes.buttonGroupRoot }}>
        {hakuStore.showHakutulosFilters ? (
          <Button
            classes={{
              root: classes.buttonRoot,
              label: classes.buttonLabel,
            }}
            onClick={() => handleFiltersShowToggle()}>
            {buttonText()}
          </Button>
        ) : (
          <Button
            endIcon={
              <Badge
                // showZero

                color="error"
                badgeContent={_.reduce(
                  hakuStore.filter,
                  (acc, currArr) => acc + _.size(currArr),
                  0
                )}>
                <FilterList />
              </Badge>
            }
            classes={{
              root: classes.buttonRoot,
              label: classes.buttonLabel,
            }}
            onClick={() => handleFiltersShowToggle()}>
            {t('haku.rajaa-tuloksia')}
          </Button>
        )}
      </ButtonGroup>
    </Hidden>
  );
};

export default observer(MobileToggleFiltersButton);
