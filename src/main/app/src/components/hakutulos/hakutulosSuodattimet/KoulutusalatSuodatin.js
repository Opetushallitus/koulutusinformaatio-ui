import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
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
import { ExpandMore } from '@material-ui/icons';
import qs from 'query-string';
import _ from 'lodash';
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
import { MUI_BREAKPOINTS } from '../../../constants';

const useStyles = makeStyles((theme) => ({
  buttonLabel: {
    fontSize: 14,
  },
}));

const KoulutusalatSuodatin = ({ expanded, elevation, displaySelected }) => {
  const history = useHistory();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const classes = useStyles();
  const { hakuStore } = useStores();
  const { koulutusFilters, oppilaitosFilters, toggle, filter } = hakuStore;
  const muiScreenSizeMinMd = useMediaQuery(MUI_BREAKPOINTS.MIN_MD);

  const [koulutusAlat, setKoulutusAlat] = useState([]);
  const [valitutKoulutusAlat, setValitutKoulutusAlat] = useState([]);
  const [selectedKoulutusalatStr, setSelectedKoulutusalatStr] = useState('');
  const [expandedKoulutusTaso1, setExpandedKoulutusTaso1] = useState([]);

  useEffect(() => {
    const koulutusalatJS =
      toggle === 'koulutus'
        ? Object.entries(koulutusFilters.koulutusala)
        : Object.entries(oppilaitosFilters.koulutusala);

    setKoulutusAlat(_.orderBy(koulutusalatJS, [`[1]nimi.[${i18n.language}]`]));
    setValitutKoulutusAlat(filter.koulutusala);
    setSelectedKoulutusalatStr(
      filter.koulutusala.map((ka) => ka?.['name']?.[i18n.language]).join(', ')
    );
  }, [
    filter.koulutusala,
    i18n.language,
    koulutusFilters.koulutusala,
    location,
    oppilaitosFilters.koulutusala,
    toggle,
  ]);

  // Jos 2:n tason koulutusalan suodatin-lista avattu ja arvot muuttuu, korvataan sen storessa olevalla
  useEffect(() => {
    if (_.size(expandedKoulutusTaso1) > 0) {
      setExpandedKoulutusTaso1(
        _.find(koulutusAlat, (ka) => ka[0] === expandedKoulutusTaso1[0])
      );
    }
  }, [expandedKoulutusTaso1, koulutusAlat]);

  const handleKoulutusalaOuterToggle = (koulutusalaTaso1) => () => {
    setExpandedKoulutusTaso1(koulutusalaTaso1);
  };

  const handleKoulutusalaInnerToggle = (koulutusID, obj) => () => {
    const koulutusalaFilterObj = {
      id: koulutusID,
      name: obj?.nimi,
    };
    const currentIndex = valitutKoulutusAlat.findIndex(({ id }) => id === koulutusID);
    const newValitutKoulutusalat = [...valitutKoulutusAlat];

    if (currentIndex === -1) {
      newValitutKoulutusalat.push(koulutusalaFilterObj);
    } else {
      newValitutKoulutusalat.splice(currentIndex, 1);
    }

    setValitutKoulutusAlat(newValitutKoulutusalat);
    const search = qs.parse(history.location.search);
    search.koulutusala = newValitutKoulutusalat.map(({ id }) => id).join(',');
    search.kpage = 1;
    search.opage = 1;
    hakuStore.setKoulutusalaFilter(newValitutKoulutusalat);
    history.replace({ search: qs.stringify(search) });
    hakuStore.clearOffsetAndPaging();
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

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
        onClick={handleKoulutusalaInnerToggle(
          expandedKoulutusTaso1[0],
          expandedKoulutusTaso1[1]
        )}
        disabled={expandedKoulutusTaso1[1]?.count === 0}>
        <ListItemIcon>
          <SuodatinCheckbox
            edge="start"
            checked={
              valitutKoulutusAlat.findIndex(
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
                {expandedKoulutusTaso1[1]?.nimi?.[i18n.language]}
              </Grid>
              <Grid item>
                {_.isNil(expandedKoulutusTaso1[1]?.count)
                  ? ''
                  : `(${expandedKoulutusTaso1[1]?.count})`}
              </Grid>
            </Grid>
          }
        />
      </ListItem>
      <Divider style={{ margin: '10px 0' }} />
      {expandedKoulutusTaso1[1]?.alakoodit &&
        Object.keys(expandedKoulutusTaso1[1]?.alakoodit).map((koulutusTaso2_ID) => (
          <ListItem
            key={koulutusTaso2_ID}
            dense
            button
            onClick={handleKoulutusalaInnerToggle(
              koulutusTaso2_ID,
              expandedKoulutusTaso1[1]?.alakoodit?.[koulutusTaso2_ID]
            )}
            disabled={
              expandedKoulutusTaso1[1]?.alakoodit?.[koulutusTaso2_ID]?.count === 0
            }>
            <ListItemIcon>
              <SuodatinCheckbox
                edge="start"
                checked={
                  valitutKoulutusAlat.findIndex(({ id }) => id === koulutusTaso2_ID) !==
                  -1
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
                    {
                      expandedKoulutusTaso1[1]?.alakoodit?.[koulutusTaso2_ID]?.nimi?.[
                        i18n.language
                      ]
                    }
                  </Grid>
                  <Grid item>
                    {_.isNil(
                      expandedKoulutusTaso1[1]?.alakoodit?.[koulutusTaso2_ID]?.count
                    )
                      ? ''
                      : `(${expandedKoulutusTaso1[1]?.alakoodit?.[koulutusTaso2_ID]?.count})`}
                  </Grid>
                </Grid>
              }
            />
          </ListItem>
        ))}
    </List>
  );

  return (
    <SuodatinExpansionPanel elevation={elevation} defaultExpanded={expanded}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <SummaryContent
          selectedFiltersStr={selectedKoulutusalatStr}
          maxCharLengthBeforeChipWithNumber={20}
          filterName={t('haku.koulutusalat')}
          displaySelected={displaySelected}
        />
      </SuodatinExpansionPanelSummary>
      <SuodatinExpansionPanelDetails>
        <List hidden={expandedKoulutusTaso1.length > 0} style={{ width: '100%' }}>
          {koulutusAlat.map((koulutusalaArr) => {
            const labelId = `language-list-label-${koulutusalaArr[0]}`;
            const isSelected = _.keys(koulutusalaArr[1]?.alakoodit)
              .concat(koulutusalaArr[0])
              .some((sf) => _.find(valitutKoulutusAlat, { id: sf }));
            return (
              <ListItem
                key={koulutusalaArr[0]}
                dense
                button
                onClick={handleKoulutusalaOuterToggle(koulutusalaArr)}
                disabled={koulutusalaArr[1].count === 0}>
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
                      <Grid item>{koulutusalaArr[1].nimi?.[i18n.language]}</Grid>
                      <Grid item>
                        {_.isNil(koulutusalaArr[1]?.count)
                          ? '()'
                          : `(${koulutusalaArr[1]?.count})`}
                      </Grid>
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

export default observer(KoulutusalatSuodatin);
