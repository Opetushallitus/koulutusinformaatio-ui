import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
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

const withStyles = makeStyles(() => ({
  noBoxShadow: {
    boxShadow: 'none',
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
    checkedKoulutustyypit,
    checkedKoulutustyypitStr,
    checkedKoulutustyypitKeys,
  } = useSelector(getKoulutustyyppiFilterProps);
  const apiRequestParams = useSelector(getAPIRequestParams);

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

  return (
    <SuodatinExpansionPanel
      {...(summaryHidden && { className: classes.noBoxShadow })}
      elevation={elevation}
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
        <List style={{ width: '100%' }}>
          {koulutustyyppi.map((koulutustyyppiOuter) => {
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
                        <Grid item>{l.localize(koulutustyyppiOuter[1])}</Grid>
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
                              <Grid item>{l.localize(koulutustyyppiInnerEntry[1])}</Grid>
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
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
};

export default KoulutustyyppiSuodatin;
