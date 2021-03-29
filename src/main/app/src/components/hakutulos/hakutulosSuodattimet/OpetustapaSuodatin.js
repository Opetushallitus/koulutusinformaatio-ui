import React from 'react';

import { Grid, List, ListItem, ListItemIcon, makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useQueryParams } from '#/src/hooks';
import {
  clearPaging,
  searchAll,
  setOpetustapa,
} from '#/src/store/reducers/hakutulosSlice';
import { getOpetustapaFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';
import { localize } from '#/src/tools/localization';

import { useUrlParams } from '../UseUrlParams';
import {
  SuodatinCheckbox,
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import { SummaryContent } from './SummaryContent';

const withStyles = makeStyles(() => ({
  noBoxShadow: {
    boxShadow: 'none',
  },
}));

const OpetustapaSuodatin = ({
  expanded,
  elevation,
  displaySelected,
  summaryHidden = false,
}) => {
  const { updateUrlSearchParams } = useUrlParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const apiRequestParams = useQueryParams();
  const classes = withStyles();
  const { sortedOpetustavat, checkedOpetustavat, checkedOpetustavatStr } = useSelector(
    getOpetustapaFilterProps
  );

  const handleCheck = (opetustapaKey, opetustapaValue) => () => {
    const checkedOpetustapaObj = {
      id: opetustapaKey,
      name: opetustapaValue?.nimi,
    };
    const currentIndex = checkedOpetustavat.findIndex(
      ({ id }) => id === checkedOpetustapaObj.id
    );
    const newCheckedOpetustavat = [...checkedOpetustavat];

    if (currentIndex === -1) {
      newCheckedOpetustavat.push(checkedOpetustapaObj);
    } else {
      newCheckedOpetustavat.splice(currentIndex, 1);
    }
    const newCheckedOpetustavatStr = newCheckedOpetustavat.map(({ id }) => id).join(',');

    dispatch(setOpetustapa({ newCheckedOpetustavat }));

    updateUrlSearchParams({ opetustapa: newCheckedOpetustavatStr });
    dispatch(clearPaging());
    dispatch(searchAll({ ...apiRequestParams, opetustapa: newCheckedOpetustavatStr }));
  };

  // TODO: Use Filter.tsx if possible
  return (
    <SuodatinAccordion
      {...(summaryHidden && { className: classes.noBoxShadow })}
      elevation={elevation}
      data-cy="opetustapa-filter"
      defaultExpanded={expanded}>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            selectedFiltersStr={checkedOpetustavatStr}
            maxCharLengthBeforeChipWithNumber={20}
            filterName={t('haku.opetustapa')}
            displaySelected={displaySelected}
          />
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <List style={{ width: '100%' }}>
          {sortedOpetustavat.map(([opetustapaKey, opetustapaValue]) => {
            const labelId = `opetustapa-filter-${opetustapaKey}`;
            return (
              <ListItem
                key={opetustapaKey}
                dense
                button
                onClick={handleCheck(opetustapaKey, opetustapaValue)}>
                <ListItemIcon>
                  <SuodatinCheckbox
                    edge="start"
                    checked={checkedOpetustavat.some(({ id }) => id === opetustapaKey)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <SuodatinListItemText
                  id={labelId}
                  primary={
                    <Grid container justify="space-between" wrap="nowrap">
                      <Grid item>{localize(opetustapaValue)}</Grid>
                      <Grid item>{`(${opetustapaValue?.count})`}</Grid>
                    </Grid>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};

export default OpetustapaSuodatin;
