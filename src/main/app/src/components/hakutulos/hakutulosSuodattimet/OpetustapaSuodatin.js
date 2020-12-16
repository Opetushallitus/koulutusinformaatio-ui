import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import { Grid, List, ListItem, ListItemIcon, makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import {
  clearPaging,
  searchAll,
  setOpetustapa,
} from '#/src/store/reducers/hakutulosSlice';
import { getOpetustapaFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  SuodatinCheckbox,
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import SummaryContent from './SummaryContent';
import { Common as C, Localizer as l } from '#/src/tools/Utils';
import { useQueryParams } from '#/src/hooks';

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
  const history = useHistory();
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

    const search = qs.parse(history.location.search);
    search.opetustapa = newCheckedOpetustavatStr;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(C.cleanRequestParams(search)) });
    dispatch(clearPaging());
    dispatch(searchAll({ ...apiRequestParams, opetustapa: newCheckedOpetustavatStr }));
  };
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
                      <Grid item>{l.localize(opetustapaValue)}</Grid>
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
