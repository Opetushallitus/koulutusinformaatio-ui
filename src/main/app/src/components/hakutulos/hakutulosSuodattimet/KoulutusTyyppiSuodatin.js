import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  Button,
  ButtonGroup,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  useTheme,
  makeStyles,
} from '@material-ui/core';
import { ExpandMore, IndeterminateCheckBoxOutlined } from '@material-ui/icons';
import { twoLevelFilterUpdateAndSearch } from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getKoulutustyyppiFilterProps,
} from '#/src/store/reducers/hakutulosSliceSelector';
import {
  SuodatinCheckbox,
  SuodatinExpansionPanel,
  SuodatinExpansionPanelDetails,
  SuodatinExpansionPanelSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import SummaryContent from './SummaryContent';
import { Localizer as l } from '#/src/tools/Utils';
import { FILTER_TYPES } from '#/src/constants';
import { colors } from '#/src/colors';

const withStyles = makeStyles(() => ({
  noBoxShadow: {
    boxShadow: 'none',
  },
  buttonRoot: {
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  buttonActive: {
    backgroundColor: colors.green,
    color: colors.white,
    '&:hover': {
      backgroundColor: colors.green,
    },
  },
  buttonInactive: {
    backgroundColor: colors.white,
    color: colors.green,
  },
}));

const KoulutustyyppiSuodatin = ({
  expanded,
  elevation,
  displaySelected,
  summaryHidden = false,
}) => {
  const classes = withStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    koulutustyyppi,
    koulutustyyppiMuu,
    checkedKoulutustyypit,
    checkedKoulutustyypitStr,
    checkedKoulutustyypitKeys,
  } = useSelector(getKoulutustyyppiFilterProps);
  const apiRequestParams = useSelector(getAPIRequestParams);

  const [isMuuSelected, setIsMuuSelected] = useState(false);
  const koulutustyyppiOrKoulutusTyyppiMuu = isMuuSelected
    ? koulutustyyppiMuu
    : koulutustyyppi;
  const handleKoulutustyyppiClick = (clickedFilterId, parentFilterId) => () => {
    dispatch(
      twoLevelFilterUpdateAndSearch({
        filterType: FILTER_TYPES.KOULUTUSTYYPPI,
        apiRequestParams,
        clickedFilterId,
        parentFilterId,
        history,
      })
    );
  };

  function isIndeterminate(koulutustyyppiEntry = []) {
    const alakooditKeys = _.keys(_.get(koulutustyyppiEntry, '[1].alakoodit'));
    const areAllAlakooditChecked = _.every(alakooditKeys, (id) =>
      _.includes(checkedKoulutustyypitKeys, id)
    );
    const areSomeAlakoodiChecked = _.some(alakooditKeys, (id) =>
      _.includes(checkedKoulutustyypitKeys, id)
    );
    return areSomeAlakoodiChecked && !areAllAlakooditChecked;
  }

  function getLocalizedKoulutustyyppi(_koulutustyyppiEntry) {
    return l.localize(_koulutustyyppiEntry[1]) || t(`haku.${_koulutustyyppiEntry[0]}`);
  }

  return (
    <SuodatinExpansionPanel
      {...(summaryHidden && { className: classes.noBoxShadow })}
      elevation={elevation}
      data-cy="koulutustyyppi-filter"
      defaultExpanded={expanded}>
      {!summaryHidden && (
        <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            selectedFiltersStr={checkedKoulutustyypitStr}
            maxCharLengthBeforeChipWithNumber={16}
            filterName={t('haku.koulutustyyppi')}
            displaySelected={displaySelected}
          />
        </SuodatinExpansionPanelSummary>
      )}
      <SuodatinExpansionPanelDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container>
          <Grid item xs={12} style={{ padding: '20px 0' }}>
            <ButtonGroup fullWidth>
              <Button
                style={{ minWidth: '155px' }}
                className={!isMuuSelected ? classes.buttonActive : classes.buttonInactive}
                classes={{ root: classes.buttonRoot }}
                aria-selected={!isMuuSelected}
                onClick={() => setIsMuuSelected(false)}>
                {t('haku.tutkintoon-johtavat')}
              </Button>
              <Button
                className={isMuuSelected ? classes.buttonActive : classes.buttonInactive}
                classes={{ root: classes.buttonRoot }}
                aria-selected={isMuuSelected}
                onClick={() => setIsMuuSelected(true)}>
                {t('haku.muut')}
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <List style={{ width: '100%' }}>
              {koulutustyyppiOrKoulutusTyyppiMuu.map((koulutustyyppiOuter) => {
                const labelId = `educationtype-outerlist-label-${koulutustyyppiOuter[0]}`;
                return (
                  <React.Fragment key={`fragment-${koulutustyyppiOuter[0]}`}>
                    <ListItem
                      key={koulutustyyppiOuter[0]}
                      id={koulutustyyppiOuter[0]}
                      dense
                      button
                      onClick={handleKoulutustyyppiClick(koulutustyyppiOuter[0])}>
                      <ListItemIcon>
                        <SuodatinCheckbox
                          indeterminateIcon={<IndeterminateCheckBoxOutlined />}
                          indeterminate={isIndeterminate(koulutustyyppiOuter)}
                          edge="start"
                          checked={
                            checkedKoulutustyypit.findIndex(
                              ({ id }) => id === koulutustyyppiOuter[0]
                            ) !== -1
                          }
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <SuodatinListItemText
                        id={labelId}
                        primary={
                          <Grid container justify="space-between" wrap="nowrap">
                            <Grid item>{t(`haku.${koulutustyyppiOuter[0]}`)}</Grid>
                            <Grid item>{`(${koulutustyyppiOuter[1].count || 0})`}</Grid>
                          </Grid>
                        }
                      />
                    </ListItem>
                    {_.entries(_.get(koulutustyyppiOuter, '[1].alakoodit')).map(
                      (koulutustyyppiInnerEntry) => {
                        const labelId = `${koulutustyyppiOuter[0]}_${koulutustyyppiInnerEntry[0]}_label`;
                        return (
                          <ListItem
                            style={{ paddingLeft: theme.spacing(2.2) }}
                            key={`${koulutustyyppiOuter[0]}_${koulutustyyppiInnerEntry[0]}`}
                            id={`${koulutustyyppiOuter[0]}_${koulutustyyppiInnerEntry[0]}`}
                            dense
                            button
                            onClick={handleKoulutustyyppiClick(
                              koulutustyyppiInnerEntry[0],
                              koulutustyyppiOuter[0]
                            )}>
                            <ListItemIcon>
                              <SuodatinCheckbox
                                edge="start"
                                checked={
                                  checkedKoulutustyypit.findIndex(
                                    ({ id }) => id === koulutustyyppiInnerEntry[0]
                                  ) !== -1
                                }
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </ListItemIcon>
                            <SuodatinListItemText
                              id={labelId}
                              primary={
                                <Grid container justify="space-between" wrap="nowrap">
                                  <Grid item>
                                    {getLocalizedKoulutustyyppi(koulutustyyppiInnerEntry)}
                                  </Grid>
                                  <Grid item>
                                    {`(${koulutustyyppiInnerEntry[1].count || 0})`}
                                  </Grid>
                                </Grid>
                              }
                            />
                          </ListItem>
                        );
                      }
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
};

export default KoulutustyyppiSuodatin;
