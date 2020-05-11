import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import { Grid, List, ListItem, ListItemIcon, useTheme } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import {
  clearPaging,
  searchAll,
  setKoulutustyyppi,
} from '#/src/store/reducers/hakutulosSlice';
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
import { Common as C } from '#/src/tools/Utils';

const KoulutustyyppiSuodatin = ({ expanded, elevation, displaySelected }) => {
  const history = useHistory();
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const koulutustyyppiFilterProps = useSelector(getKoulutustyyppiFilterProps);
  const apiRequestParams = useSelector(getAPIRequestParams);

  const [koulutusTyypit, setKoulutusTyypit] = useState([]);
  const [checkedKoulutustyypit, setCheckedKoulutustyypit] = useState([]);
  const [checkedKoulutustyypitStr, setCheckedKoulutustyypitStr] = useState('');

  useEffect(() => {
    setKoulutusTyypit(koulutustyyppiFilterProps.koulutustyyppi);
    setCheckedKoulutustyypit(koulutustyyppiFilterProps.checkedKoulutustyypit);
    setCheckedKoulutustyypitStr(koulutustyyppiFilterProps.checkedKoulutustyypitStr);
  }, [koulutustyyppiFilterProps]);

  const handleEduTypeToggle = (koulutustyyppiObj) => () => {
    const koulutustyyppiFilterObj = {
      id: koulutustyyppiObj[0],
      name: koulutustyyppiObj[1]?.nimi,
    };
    const currentIndex = checkedKoulutustyypit.findIndex(
      ({ id }) => id === koulutustyyppiFilterObj.id
    );
    const newCheckedKoulutustyypit = [...checkedKoulutustyypit];

    if (currentIndex === -1) {
      newCheckedKoulutustyypit.push(koulutustyyppiFilterObj);
    } else {
      newCheckedKoulutustyypit.splice(currentIndex, 1);
    }
    const newValitutKoulutusTyypitStr = newCheckedKoulutustyypit
      .map(({ id }) => id)
      .join(',');

    setCheckedKoulutustyypit(newCheckedKoulutustyypit);
    dispatch(
      setKoulutustyyppi({
        newCheckedKoulutustyypit,
      })
    );

    const search = qs.parse(history.location.search);
    search.koulutustyyppi = newValitutKoulutusTyypitStr;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(C.cleanRequestParams(search)) });
    dispatch(clearPaging());
    dispatch(
      searchAll({ ...apiRequestParams, koulutustyyppi: newValitutKoulutusTyypitStr })
    );
  };

  return (
    <SuodatinExpansionPanel elevation={elevation} defaultExpanded={expanded}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <SummaryContent
          selectedFiltersStr={checkedKoulutustyypitStr}
          maxCharLengthBeforeChipWithNumber={16}
          filterName={t('haku.koulutustyyppi')}
          displaySelected={displaySelected}
        />
      </SuodatinExpansionPanelSummary>
      <SuodatinExpansionPanelDetails>
        <List style={{ width: '100%' }}>
          {koulutusTyypit.map((eduTypeOuterArr) => {
            const labelId = `educationtype-outerlist-label-${eduTypeOuterArr[0]}`;
            return (
              <React.Fragment key={`fragment-${eduTypeOuterArr[0]}`}>
                <ListItem
                  key={eduTypeOuterArr[0]}
                  id={eduTypeOuterArr[0]}
                  dense
                  button
                  onClick={handleEduTypeToggle(eduTypeOuterArr)}
                  disabled={eduTypeOuterArr[1].count === 0}>
                  <ListItemIcon>
                    <SuodatinCheckbox
                      edge="start"
                      checked={
                        checkedKoulutustyypit.findIndex(
                          ({ id }) => id === eduTypeOuterArr[0]
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
                        <Grid item>{eduTypeOuterArr[1].nimi.fi}</Grid>
                        <Grid item>{`(${eduTypeOuterArr[1].count})`}</Grid>
                      </Grid>
                    }
                  />
                </ListItem>
                {eduTypeOuterArr[1].alakoodit &&
                  Object.entries(eduTypeOuterArr[1].alakoodit).map((eduTypeInnerArr) => {
                    return (
                      <ListItem
                        style={{ paddingLeft: theme.spacing(2.2) }}
                        key={`${eduTypeOuterArr[0]}_${eduTypeInnerArr[0]}`}
                        id={`${eduTypeOuterArr[0]}_${eduTypeInnerArr[0]}`}
                        dense
                        button
                        onClick={handleEduTypeToggle(eduTypeInnerArr)}
                        disabled={eduTypeInnerArr[1].count === 0}>
                        <ListItemIcon>
                          <SuodatinCheckbox
                            edge="start"
                            checked={
                              checkedKoulutustyypit.findIndex(
                                ({ id }) => id === eduTypeInnerArr[0]
                              ) !== -1
                            }
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <SuodatinListItemText
                          id={`this ${labelId}_${eduTypeInnerArr}`}
                          primary={
                            <Grid container justify="space-between" wrap="nowrap">
                              <Grid item>
                                {eduTypeInnerArr[1]?.nimi?.[i18n.language]}
                              </Grid>
                              <Grid item>{`(${eduTypeInnerArr[1]?.count})`}</Grid>
                            </Grid>
                          }
                        />
                      </ListItem>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </List>
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
};

export default KoulutustyyppiSuodatin;
