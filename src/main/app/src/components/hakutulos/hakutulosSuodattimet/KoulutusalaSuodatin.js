import React, { useEffect, useState } from 'react';

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
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FILTER_TYPES, MUI_BREAKPOINTS } from '#/src/constants';
import { useQueryParams } from '#/src/hooks';
import { twoLevelFilterUpdateAndSearch } from '#/src/store/reducers/hakutulosSlice';
import { getKoulutusalaFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';
import { localize } from '#/src/tools/localization';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  KonfoCheckbox,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import { SummaryContent } from './SummaryContent';

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
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    sortedKoulutusalat,
    checkedKoulutusalat,
    checkedKoulutusalatKeys,
    checkedKoulutusalatStr,
  } = useSelector(getKoulutusalaFilterProps);
  const apiRequestParams = useQueryParams();
  const muiScreenSizeMinMd = useMediaQuery(MUI_BREAKPOINTS.MIN_MD);

  const [openedKoulutusala, setOpenedKoulutusala] = useState([]);

  // Jos 2:n tason koulutusalan suodatin-lista avattu ja arvot muuttuu, korvataan sen storessa olevalla
  useEffect(() => {
    if (_.size(openedKoulutusala) > 0) {
      setOpenedKoulutusala(
        _.find(sortedKoulutusalat, (ka) => ka[0] === openedKoulutusala[0])
      );
    }
  }, [openedKoulutusala, sortedKoulutusalat]);

  const handleKoulutusalaOuterToggle = (koulutusalaTaso1) => () => {
    setOpenedKoulutusala(koulutusalaTaso1);
  };

  const handleKoulutusalaInnerToggle = (clickedFilterId, parentFilterId) => () => {
    dispatch(
      twoLevelFilterUpdateAndSearch({
        filterType: FILTER_TYPES.KOULUTUSALA,
        apiRequestParams,
        clickedFilterId,
        parentFilterId,
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
    <List style={{ width: '100%' }} hidden={openedKoulutusala.length === 0}>
      <Button
        color="secondary"
        size="small"
        classes={{ label: classes.buttonLabel }}
        onClick={() => setOpenedKoulutusala([])}>
        {t('haku.__kaikki_koulutusalat')}
      </Button>
      <ListItem
        key={openedKoulutusala[0]}
        id={openedKoulutusala[0]}
        dense
        button
        onClick={handleKoulutusalaInnerToggle(openedKoulutusala[0])}>
        <ListItemIcon>
          <KonfoCheckbox
            indeterminateIcon={<IndeterminateCheckBoxOutlined />}
            indeterminate={isIndeterminate(openedKoulutusala)}
            edge="start"
            checked={checkedKoulutusalat.some(({ id }) => id === openedKoulutusala[0])}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': `koulutusala_${openedKoulutusala[0]}` }}
          />
        </ListItemIcon>
        <SuodatinListItemText
          id={`koulutusala_${openedKoulutusala[0]}`}
          primary={
            <Grid container justify="space-between" wrap="nowrap">
              <Grid item style={{ fontWeight: 'bold' }}>
                {localize(openedKoulutusala[1])}
              </Grid>
              <Grid item>{`(${_.get(openedKoulutusala, `[1].count`) || 0})`}</Grid>
            </Grid>
          }
        />
      </ListItem>
      <Divider style={{ margin: '10px 0' }} />
      {_.keys(_.get(openedKoulutusala, '[1].alakoodit')).map((kaTaso2Id) => (
        <ListItem
          key={kaTaso2Id}
          id={kaTaso2Id}
          dense
          button
          onClick={handleKoulutusalaInnerToggle(kaTaso2Id, openedKoulutusala[0])}>
          <ListItemIcon>
            <KonfoCheckbox
              edge="start"
              checked={checkedKoulutusalat.some(({ id }) => id === kaTaso2Id)}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': `${openedKoulutusala[0]}_${kaTaso2Id}` }}
            />
          </ListItemIcon>
          <SuodatinListItemText
            id={`${openedKoulutusala[0]}_${kaTaso2Id}`}
            primary={
              <Grid container justify="space-between" wrap="nowrap">
                <Grid item>{localize(openedKoulutusala[1]?.alakoodit?.[kaTaso2Id])}</Grid>
                <Grid item>
                  {`(${openedKoulutusala[1]?.alakoodit?.[kaTaso2Id]?.count || 0})`}
                </Grid>
              </Grid>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  // TODO: Use Filter.tsx if possible
  return (
    <SuodatinAccordion
      {...(summaryHidden && { className: classes.noBoxShadow })}
      elevation={elevation}
      data-cy="koulutusalat-filter"
      defaultExpanded={expanded}>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            selectedFiltersStr={checkedKoulutusalatStr}
            maxCharLengthBeforeChipWithNumber={20}
            filterName={t('haku.koulutusalat')}
            displaySelected={displaySelected}
          />
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <List hidden={openedKoulutusala.length > 0} style={{ width: '100%' }}>
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
                      <Grid item>{localize(koulutusalaArr[1])}</Grid>
                      <Grid item>{`(${_.get(koulutusalaArr, '[1].count') || 0})`}</Grid>
                    </Grid>
                  }
                />
              </ListItem>
            );
          })}
        </List>
        <KoulutuksetTaso2 />
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};

export default KoulutusalaSuodatin;
