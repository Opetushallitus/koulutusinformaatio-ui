import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import { ButtonGroup, Button, makeStyles, Typography } from '@material-ui/core';
import { getHakutulosToggleProps } from '#/src/store/reducers/hakutulosSliceSelector';
import { setSelectedTab } from '#/src/store/reducers/hakutulosSlice';
import { colors } from '#/src/colors';
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelDetails,
  SuodatinExpansionPanelSummary,
} from './hakutulosSuodattimet/CustomizedMuiComponents';
import { ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  buttonActive: {
    backgroundColor: colors.green,
    color: colors.white,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: colors.green,
    },
  },
  buttonInactive: {
    backgroundColor: colors.white,
    color: colors.green,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

const MobileToggleKoulutusOppilaitos = () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedTab } = useSelector(getHakutulosToggleProps);

  function updateSelectedTab(e) {
    const newSelectedTab = e.currentTarget.ariaLabel;
    const search = qs.parse(history.location.search);
    search.tab = newSelectedTab;
    history.replace({ search: qs.stringify(search) });
    dispatch(setSelectedTab({ newSelectedTab }));
  }

  return (
    <SuodatinExpansionPanel style={{ boxShadow: 'none' }} defaultExpanded elevation={0}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">{t('haku.kategoria')}</Typography>
      </SuodatinExpansionPanelSummary>
      <SuodatinExpansionPanelDetails>
        <ButtonGroup fullWidth>
          <Button
            aria-label="koulutus"
            className={selectedTab === 0 ? classes.buttonActive : classes.buttonInactive}
            onClick={updateSelectedTab}>
            {t('haku.koulutukset')}
          </Button>
          <Button
            aria-label="oppilaitos"
            className={selectedTab === 1 ? classes.buttonActive : classes.buttonInactive}
            onClick={updateSelectedTab}>
            {t('haku.oppilaitokset')}
          </Button>
        </ButtonGroup>
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
};

export default MobileToggleKoulutusOppilaitos;
