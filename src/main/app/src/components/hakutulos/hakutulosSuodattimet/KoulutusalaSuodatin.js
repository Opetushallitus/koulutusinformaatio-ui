import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import { ExpandMore, IndeterminateCheckBoxOutlined } from '@material-ui/icons';
import SummaryContent from './SummaryContent';
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelSummary,
  SuodatinExpansionPanelDetails,
  SuodatinCheckbox,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import {
  getKoulutusalaFilterProps,
  getAPIRequestParams,
} from '#/src/store/reducers/hakutulosSliceSelector';
import { twoLevelFilterUpdateAndSearch } from '#/src/store/reducers/hakutulosSlice';
import { MUI_BREAKPOINTS, FILTER_TYPES } from '#/src/constants';
import { Localizer as l } from '#/src/tools/Utils';

const useStyles = makeStyles((theme) => ({
  buttonLabel: {
    fontSize: 14,
  },
  noBoxShadow: {
    boxShadow: 'none',
  },
}));

const KoulutusalaSuodatin = ({
  expanded,
  elevation,
  displaySelected,
  summaryHidden = false,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    sortedKoulutusalat,
    checkedKoulutusalat,
    checkedKoulutusalatKeys,
    checkedKoulutusalatStr,
  } = useSelector(getKoulutusalaFilterProps);
  const apiRequestParams = useSelector(getAPIRequestParams);
  const muiScreenSizeMinMd = useMediaQuery(MUI_BREAKPOINTS.MIN_MD);

  const [expandedKoulutusTaso1, setExpandedKoulutusTaso1] = useState([]);

  // Jos 2:n tason koulutusalan suodatin-lista avattu ja arvot muuttuu, korvataan sen storessa olevalla
  useEffect(() => {
    if (_.size(expandedKoulutusTaso1) > 0) {
      setExpandedKoulutusTaso1(
        _.find(sortedKoulutusalat, (ka) => ka[0] === expandedKoulutusTaso1[0])
      );
    }
  }, [expandedKoulutusTaso1, sortedKoulutusalat]);

  const handleKoulutusalaOuterToggle = (koulutusalaTaso1) => () => {
    setExpandedKoulutusTaso1(koulutusalaTaso1);
  };

  const handleKoulutusalaInnerToggle = (clickedFilterId, parentFilterId) => () => {
    dispatch(
      twoLevelFilterUpdateAndSearch({
        filterType: FILTER_TYPES.KOULUTUSALA,
        apiRequestParams,
        clickedFilterId,
        parentFilterId,
        history,
      })
    );
  };

  function isIndeterminate(koulutusalaEntry = []) {
    const alakooditKeys = _.keys(_.get(koulutusalaEntry, '[1].alakoodit'));
    const areAllAlakooditChecked = _.every(alakooditKeys, (id) =>
      _.includes(checkedKoulutusalatKeys, id)
    );
    const areSomeAlakoodiChecked = _.some(alakooditKeys, (id) =>
      _.includes(checkedKoulutusalatKeys, id)
    );
    return areSomeAlakoodiChecked && !areAllAlakooditChecked;
  }

  const KoulutuksetTaso2 = () => (
    <List style={{ width: '100%' }} hidden={expandedKoulutusTaso1.length === 0}>
      <Button
        color="secondary"
        size="small"
        classes={{ label: classes.buttonLabel }}
        onClick={() => setExpandedKoulutusTaso1([])}>
        {t('haku.__kaikki_koulutusalat')}
      </Button>
      <ListItem
        key={expandedKoulutusTaso1[0]}
        dense
        button
        onClick={handleKoulutusalaInnerToggle(expandedKoulutusTaso1[0])}>
        <ListItemIcon>
          <SuodatinCheckbox
            indeterminateIcon={<IndeterminateCheckBoxOutlined />}
            indeterminate={isIndeterminate(expandedKoulutusTaso1)}
            edge="start"
            checked={
              checkedKoulutusalat.findIndex(
                ({ id }) => id === expandedKoulutusTaso1[0]
              ) !== -1
            }
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <SuodatinListItemText
          id={`${expandedKoulutusTaso1[0]}_text`}
          primary={
            <Grid container justify="space-between" wrap="nowrap">
              <Grid item style={{ fontWeight: 'bold' }}>
                {l.localize(expandedKoulutusTaso1[1])}
              </Grid>
              <Grid item>{`(${_.get(expandedKoulutusTaso1, `[1].count`) || 0})`}</Grid>
            </Grid>
          }
        />
      </ListItem>
      <Divider style={{ margin: '10px 0' }} />
      {_.keys(_.get(expandedKoulutusTaso1, '[1].alakoodit')).map((koulutusTaso2_ID) => (
        <ListItem
          key={koulutusTaso2_ID}
          dense
          button
          onClick={handleKoulutusalaInnerToggle(
            koulutusTaso2_ID,
            expandedKoulutusTaso1[0]
          )}>
          <ListItemIcon>
            <SuodatinCheckbox
              edge="start"
              checked={
                checkedKoulutusalat.findIndex(({ id }) => id === koulutusTaso2_ID) !== -1
              }
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <SuodatinListItemText
            id={`${expandedKoulutusTaso1[0]}_${koulutusTaso2_ID}`}
            primary={
              <Grid container justify="space-between" wrap="nowrap">
                <Grid item>
                  {l.localize(expandedKoulutusTaso1[1]?.alakoodit?.[koulutusTaso2_ID])}
                </Grid>
                <Grid item>
                  {`(${_.get(
                    expandedKoulutusTaso1,
                    `[1].alakoodit.${koulutusTaso2_ID}.count`
                  ) || 0})`}
                </Grid>
              </Grid>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <SuodatinExpansionPanel
      {...(summaryHidden && { className: classes.noBoxShadow })}
      elevation={elevation}
      defaultExpanded={expanded}>
      {!summaryHidden && (
        <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            selectedFiltersStr={checkedKoulutusalatStr}
            maxCharLengthBeforeChipWithNumber={20}
            filterName={t('haku.koulutusalat')}
            displaySelected={displaySelected}
          />
        </SuodatinExpansionPanelSummary>
      )}
      <SuodatinExpansionPanelDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <List hidden={expandedKoulutusTaso1.length > 0} style={{ width: '100%' }}>
          {sortedKoulutusalat.map((koulutusalaArr) => {
            const labelId = `language-list-label-${koulutusalaArr[0]}`;
            const isSelected = _.keys(koulutusalaArr[1]?.alakoodit)
              .concat(koulutusalaArr[0])
              .some((sf) => _.find(checkedKoulutusalat, { id: sf }));
            return (
              <ListItem
                key={koulutusalaArr[0]}
                dense
                button
                onClick={handleKoulutusalaOuterToggle(koulutusalaArr)}>
                <SuodatinListItemText
                  id={labelId}
                  primary={
                    <Grid
                      container
                      justify="space-between"
                      wrap="nowrap"
                      style={
                        isSelected && !muiScreenSizeMinMd ? { fontWeight: 600 } : {}
                      }>
                      <Grid item>{l.localize(koulutusalaArr[1])}</Grid>
                      <Grid item>{`(${_.get(koulutusalaArr, '[1].count') || 0})`}</Grid>
                    </Grid>
                  }
                />
              </ListItem>
            );
          })}
        </List>
        <KoulutuksetTaso2 />
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
};

export default KoulutusalaSuodatin;
