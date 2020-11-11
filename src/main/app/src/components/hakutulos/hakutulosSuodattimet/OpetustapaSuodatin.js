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
import {
  getAPIRequestParams,
  getOpetustapaFilterProps,
} from '#/src/store/reducers/hakutulosSliceSelector';
import {
  SuodatinCheckbox,
  SuodatinExpansionPanel,
  SuodatinExpansionPanelDetails,
  SuodatinExpansionPanelSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import SummaryContent from './SummaryContent';
import { Common as C, Localizer as l } from '#/src/tools/Utils';

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
  const apiRequestParams = useSelector(getAPIRequestParams);
  const classes = withStyles();
  const { sortedOpetustavat, checkedOpetustavat, checkedOpetustavatStr } = useSelector(
    getOpetustapaFilterProps
  );

  const handleCheck = (opetustapaObj) => () => {
    const checkedOpetustapaObj = {
      id: opetustapaObj[0],
      name: opetustapaObj[1]?.nimi,
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
    <SuodatinExpansionPanel
      {...(summaryHidden && { className: classes.noBoxShadow })}
      elevation={elevation}
      defaultExpanded={expanded}>
      {!summaryHidden && (
        <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            selectedFiltersStr={checkedOpetustavatStr}
            maxCharLengthBeforeChipWithNumber={20}
            filterName={t('haku.opetustapa')}
            displaySelected={displaySelected}
          />
        </SuodatinExpansionPanelSummary>
      )}
      <SuodatinExpansionPanelDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <List style={{ width: '100%' }}>
          {sortedOpetustavat.map((opetustapaArr) => {
            const labelId = `language-list-label-${opetustapaArr[0]}`;
            return (
              <ListItem
                key={opetustapaArr[0]}
                dense
                button
                onClick={handleCheck(opetustapaArr)}>
                <ListItemIcon>
                  <SuodatinCheckbox
                    edge="start"
                    checked={
                      checkedOpetustavat.find(({ id }) => id === opetustapaArr[0]) !==
                      undefined
                    }
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <SuodatinListItemText
                  id={labelId}
                  primary={
                    <Grid container justify="space-between" wrap="nowrap">
                      <Grid item>{l.localize(opetustapaArr[1])}</Grid>
                      <Grid item>{`(${opetustapaArr[1]?.count})`}</Grid>
                    </Grid>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
};

export default OpetustapaSuodatin;
