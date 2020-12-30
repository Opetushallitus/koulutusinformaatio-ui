import { Badge, Button, ButtonGroup, Hidden, makeStyles } from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '#/src/colors';

const useStyles = makeStyles(() => ({
  button: {
    backgroundColor: colors.green,
    marginBottom: '16px',
  },
  fixed: {
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

type Props = {
  hitCount?: number;
  chosenFilterCount?: number;
  handleFiltersShowToggle: VoidFunction;
  showFilters?: boolean;
  fixedPosition?: boolean;
};

export const MobileToggleFiltersButton = ({
  fixedPosition,
  hitCount,
  chosenFilterCount,
  showFilters,
  handleFiltersShowToggle,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const buttonText = useMemo(() => t('haku.nayta-hakutulos', { count: hitCount }), [
    t,
    hitCount,
  ]);

  return (
    <Hidden mdUp>
      <ButtonGroup classes={{ root: fixedPosition ? classes.fixed : classes.button }}>
        {showFilters ? (
          <Button
            classes={{
              label: classes.buttonLabel,
            }}
            onClick={handleFiltersShowToggle}>
            {buttonText}
          </Button>
        ) : (
          <Button
            endIcon={
              <Badge color="error" badgeContent={chosenFilterCount}>
                <FilterList />
              </Badge>
            }
            classes={{
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
