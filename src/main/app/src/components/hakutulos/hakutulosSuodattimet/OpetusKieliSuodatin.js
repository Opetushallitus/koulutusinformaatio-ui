import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import { Grid, List, ListItem, ListItemIcon } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import {
  clearOffsetAndPaging,
  searchAll,
  setOpetuskieli,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getOpetuskieliFilterProps,
} from '#/src/store/reducers/hakutulosSliceSelector';
import {
  SuodatinCheckbox,
  SuodatinExpansionPanel,
  SuodatinExpansionPanelDetails,
  SuodatinExpansionPanelSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import SummaryContent from './SummaryContent';
import { Common as C } from '#/src/tools/Utils';

const OpetuskieliSuodatin = ({ expanded, elevation, displaySelected }) => {
  const history = useHistory();
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const opetuskieliFilterProps = useSelector(getOpetuskieliFilterProps);
  const apiRequestParams = useSelector(getAPIRequestParams);

  const [sortedOpetuskielet, setSortedOpetuskielet] = useState([]);
  const [checkedOpetusKielet, setCheckedOpetusKielet] = useState([]);
  const [checkedOpetuskieletStr, setCheckedOpetusKieletStr] = useState('');

  useEffect(() => {
    setSortedOpetuskielet(opetuskieliFilterProps.sortedOpetuskielet);
    setCheckedOpetusKielet(opetuskieliFilterProps.checkedOpetuskielet);
    setCheckedOpetusKieletStr(opetuskieliFilterProps.checkedOpetuskieletStr);
  }, [opetuskieliFilterProps]);

  const handleCheck = (opetuskieliObj) => () => {
    const checkedOpetuskieliObj = {
      id: opetuskieliObj[0],
      name: opetuskieliObj[1]?.nimi,
    };
    const currentIndex = checkedOpetusKielet.findIndex(
      ({ id }) => id === checkedOpetuskieliObj.id
    );
    const newCheckedOpetuskielet = [...checkedOpetusKielet];

    if (currentIndex === -1) {
      newCheckedOpetuskielet.push(checkedOpetuskieliObj);
    } else {
      newCheckedOpetuskielet.splice(currentIndex, 1);
    }
    const newCheckedOpetusKieletStr = newCheckedOpetuskielet
      .map(({ id }) => id)
      .join(',');

    setCheckedOpetusKielet(newCheckedOpetuskielet);
    dispatch(setOpetuskieli({ newCheckedOpetuskielet }));

    const search = qs.parse(history.location.search);
    search.opetuskieli = newCheckedOpetusKieletStr;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(C.withoutNilValues(search)) });
    dispatch(clearOffsetAndPaging());
    dispatch(searchAll({ ...apiRequestParams, opetuskieli: newCheckedOpetusKieletStr }));
  };
  return (
    <SuodatinExpansionPanel elevation={elevation} defaultExpanded={expanded}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <SummaryContent
          selectedFiltersStr={checkedOpetuskieletStr}
          maxCharLengthBeforeChipWithNumber={20}
          filterName={t('haku.opetuskieli')}
          displaySelected={displaySelected}
        />
      </SuodatinExpansionPanelSummary>
      <SuodatinExpansionPanelDetails>
        <List style={{ width: '100%' }}>
          {sortedOpetuskielet.map((opetuskieliArr) => {
            const labelId = `language-list-label-${opetuskieliArr[0]}`;
            return (
              <ListItem
                key={opetuskieliArr[0]}
                dense
                button
                onClick={handleCheck(opetuskieliArr)}
                disabled={opetuskieliArr[1].count === 0}>
                <ListItemIcon>
                  <SuodatinCheckbox
                    edge="start"
                    checked={
                      checkedOpetusKielet.find(({ id }) => id === opetuskieliArr[0]) !==
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
                      <Grid item>{opetuskieliArr[1]?.nimi?.[i18n.language]}</Grid>
                      <Grid item>{`(${opetuskieliArr[1]?.count})`}</Grid>
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

export default OpetuskieliSuodatin;
