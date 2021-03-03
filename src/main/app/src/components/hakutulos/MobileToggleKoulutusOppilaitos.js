import React from 'react';

import { ButtonGroup, Button, makeStyles, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { colors } from '#/src/colors';
import { setSelectedTab } from '#/src/store/reducers/hakutulosSlice';
import { getHakutulosToggleProps } from '#/src/store/reducers/hakutulosSliceSelector';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
} from './hakutulosSuodattimet/CustomizedMuiComponents';

const useStyles = makeStyles((theme) => ({
  buttonActive: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },
  buttonInactive: {
    backgroundColor: colors.white,
    color: colors.brandGreen,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

const MobileToggleKoulutusOppilaitos = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedTab } = useSelector(getHakutulosToggleProps);

  function updateSelectedTab(e) {
    const newSelectedTab = e.currentTarget.dataset.tab;
    dispatch(setSelectedTab({ newSelectedTab }));
  }

  return (
    <SuodatinAccordion style={{ boxShadow: 'none' }} defaultExpanded elevation={0}>
      <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">{t('haku.kategoria')}</Typography>
      </SuodatinAccordionSummary>
      <SuodatinAccordionDetails>
        <ButtonGroup fullWidth>
          <Button
            data-tab="koulutus"
            className={
              selectedTab === 'koulutus' ? classes.buttonActive : classes.buttonInactive
            }
            onClick={updateSelectedTab}>
            {t('haku.koulutukset')}
          </Button>
          <Button
            data-tab="oppilaitos"
            className={
              selectedTab === 'oppilaitos' ? classes.buttonActive : classes.buttonInactive
            }
            onClick={updateSelectedTab}>
            {t('haku.oppilaitokset')}
          </Button>
        </ButtonGroup>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};

export default MobileToggleKoulutusOppilaitos;
