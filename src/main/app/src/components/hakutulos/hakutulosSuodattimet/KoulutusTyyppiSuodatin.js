import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import { Grid, List, ListItem, ListItemIcon, useTheme } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../hooks';
import SummaryContent from './SummaryContent';
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelSummary,
  SuodatinExpansionPanelDetails,
  SuodatinCheckbox,
  SuodatinListItemText,
} from './CustomizedMuiComponents';

const KoulutusTyyppiSuodatin = ({ expanded, elevation, displaySelected }) => {
  const history = useHistory();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { hakuStore } = useStores();
  const theme = useTheme();
  const { koulutusFilters, oppilaitosFilters, toggle, filter } = hakuStore;

  const [koulutusTyypit, setKoulutusTyypit] = useState({});
  const [valitutKoulutusTyypit, setValitutKoulutusTyypit] = useState([]);
  const [selectedKoulutustyypitStr, setSelectedKoulutustyypitStr] = useState('');

  useEffect(() => {
    const koulutusTyypitJS =
      toggle === 'koulutus'
        ? koulutusFilters.koulutusTyyppi
        : oppilaitosFilters.koulutusTyyppi;
    setKoulutusTyypit(koulutusTyypitJS);
    setValitutKoulutusTyypit(filter.koulutustyyppi);
    setSelectedKoulutustyypitStr(
      filter.koulutustyyppi.map((kt) => kt?.['name']?.[i18n.language]).join(', ')
    );
  }, [
    koulutusFilters.koulutusTyyppi,
    filter.koulutustyyppi,
    location,
    oppilaitosFilters.koulutusTyyppi,
    toggle,
    i18n.language,
  ]);

  const handleEduTypeToggle = (koulutustyyppiObj) => () => {
    const koulutustyyppiFilterObj = {
      id: koulutustyyppiObj[0],
      name: koulutustyyppiObj[1]?.nimi,
    };
    const currentIndex = valitutKoulutusTyypit.findIndex(
      ({ id }) => id === koulutustyyppiFilterObj.id
    );
    const newValitutKoulutusTyypit = [...valitutKoulutusTyypit];

    if (currentIndex === -1) {
      newValitutKoulutusTyypit.push(koulutustyyppiFilterObj);
    } else {
      newValitutKoulutusTyypit.splice(currentIndex, 1);
    }

    setValitutKoulutusTyypit(newValitutKoulutusTyypit);
    const search = qs.parse(history.location.search);
    search.koulutustyyppi = newValitutKoulutusTyypit.map(({ id }) => id).join(',');
    search.kpage = 1;
    search.opage = 1;
    hakuStore.setKoulutusTyyppiFilter(newValitutKoulutusTyypit);
    history.replace({ search: qs.stringify(search) });
    hakuStore.clearOffsetAndPaging();
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  return (
    <SuodatinExpansionPanel elevation={elevation} defaultExpanded={expanded}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <SummaryContent
          selectedFiltersStr={selectedKoulutustyypitStr}
          maxCharLengthBeforeChipWithNumber={16}
          filterName={t('haku.koulutustyyppi')}
          displaySelected={displaySelected}
        />
      </SuodatinExpansionPanelSummary>
      <SuodatinExpansionPanelDetails>
        <List style={{ width: '100%' }}>
          {Object.entries(koulutusTyypit).map((eduTypeOuterArr) => {
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
                        valitutKoulutusTyypit.findIndex(
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
                              valitutKoulutusTyypit.findIndex(
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

export default observer(KoulutusTyyppiSuodatin);
