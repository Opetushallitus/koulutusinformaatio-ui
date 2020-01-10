import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';
import { styles } from '../../../styles';
import { useStores } from '../../../hooks';
import { toJS } from 'mobx';

const KoulutusalatSuodatin = observer((props) => {
  const { classes, i18n, history, t } = props;
  const { hakuStore } = useStores();
  const { koulutusFilters, oppilaitosFilters, toggle, filter } = hakuStore;
  const { koulutusala } = filter;

  const [koulutusAlat, setKoulutusAlat] = useState([]);
  const [valitutKoulutusAlat, setValitutKoulutusAlat] = useState([]);
  const [expandedKoulutusTaso1, setExpandedKoulutusTaso1] = useState([]);

  useEffect(() => {
    const koulutusalatJS =
      toggle === 'koulutus'
        ? Object.entries(toJS(koulutusFilters.koulutusala))
        : Object.entries(toJS(oppilaitosFilters.koulutusala));

    koulutusalatJS.sort((a, b) =>
      a[1]?.nimi?.[i18n.language].localeCompare(b[1]?.nimi?.[i18n.language])
    );

    setKoulutusAlat(koulutusalatJS);
    setValitutKoulutusAlat(toJS(hakuStore.filter.koulutusala));
  }, [
    props,
    koulutusala,
    toggle,
    koulutusFilters.koulutusala,
    oppilaitosFilters.koulutusala,
    hakuStore.filter.koulutusala,
    i18n.language,
  ]);

  const handleKoulutusalaOuterToggle = (koulutusalaTaso1) => () => {
    setExpandedKoulutusTaso1(koulutusalaTaso1);
  };

  const handleKoulutusalaInnerToggle = (koulutusID, obj) => () => {
    const koulutusalaFilterObj = {
      id: koulutusID,
      name: obj?.nimi,
    };
    const currentIndex = valitutKoulutusAlat.findIndex(
      ({ id }) => id === koulutusID
    );
    const newValitutKoulutusalat = [...valitutKoulutusAlat];

    if (currentIndex === -1) {
      newValitutKoulutusalat.push(koulutusalaFilterObj);
    } else {
      newValitutKoulutusalat.splice(currentIndex, 1);
    }

    setValitutKoulutusAlat(newValitutKoulutusalat);
    const search = qs.parse(history.location.search);
    search.koulutusala = newValitutKoulutusalat.map(({ id }) => id).join(',');
    hakuStore.setKoulutusalaFilter(newValitutKoulutusalat);
    history.replace({ search: qs.stringify(search) });
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  const KoulutuksetTaso2 = () => (
    <List style={{ width: '100%' }} hidden={expandedKoulutusTaso1.length === 0}>
      <Button
        color="secondary"
        size="small"
        classes={{ label: classes.buttonSmallText }}
        onClick={() => setExpandedKoulutusTaso1([])}
      >
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
        disabled={expandedKoulutusTaso1[1]?.count === 0}
      >
        <ListItemIcon>
          <Checkbox
            classes={{ root: classes.listItemCheckbox }}
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
        <ListItemText
          classes={{ primary: classes.hakuTulosListItemText }}
          id={`${expandedKoulutusTaso1[0]}_text`}
          primary={
            <Grid container justify="space-between" wrap="nowrap">
              <Grid item style={{ fontWeight: 'bold' }}>
                {expandedKoulutusTaso1[1]?.nimi?.[i18n.language]}
              </Grid>
              <Grid item>{`(${expandedKoulutusTaso1[1]?.count})`}</Grid>
            </Grid>
          }
        />
      </ListItem>
      <Divider style={{ margin: '10px 0' }} />
      {expandedKoulutusTaso1[1]?.alakoodit &&
        Object.keys(expandedKoulutusTaso1[1]?.alakoodit).map(
          (koulutusTaso2_ID) => (
            <ListItem
              key={koulutusTaso2_ID}
              dense
              button
              onClick={handleKoulutusalaInnerToggle(
                koulutusTaso2_ID,
                expandedKoulutusTaso1[1]?.alakoodit?.[koulutusTaso2_ID]
              )}
              disabled={
                expandedKoulutusTaso1[1]?.[koulutusTaso2_ID]?.count === 0
              }
            >
              <ListItemIcon>
                <Checkbox
                  classes={{ root: classes.listItemCheckbox }}
                  edge="start"
                  checked={
                    valitutKoulutusAlat.findIndex(
                      ({ id }) => id === koulutusTaso2_ID
                    ) !== -1
                  }
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.hakuTulosListItemText }}
                id={`${expandedKoulutusTaso1[0]}_${koulutusTaso2_ID}`}
                primary={
                  <Grid container justify="space-between" wrap="nowrap">
                    <Grid item>
                      {
                        expandedKoulutusTaso1[1]?.alakoodit?.[koulutusTaso2_ID]
                          ?.nimi?.[i18n.language]
                      }
                    </Grid>
                    <Grid item>
                      {`(${expandedKoulutusTaso1[1]?.alakoodit?.[koulutusTaso2_ID]?.count})`}
                    </Grid>
                  </Grid>
                }
              />
            </ListItem>
          )
        )}
    </List>
  );

  return (
    <ExpansionPanel defaultExpanded={true}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">{t('haku.koulutusalat')}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <List
          hidden={expandedKoulutusTaso1.length > 0}
          style={{ width: '100%' }}
        >
          {koulutusAlat.map((kouutusalaArray) => {
            const labelId = `language-list-label-${kouutusalaArray[0]}`;
            return (
              <ListItem
                key={kouutusalaArray[0]}
                dense
                button
                onClick={handleKoulutusalaOuterToggle(kouutusalaArray)}
                disabled={kouutusalaArray[1].count === 0}
              >
                <ListItemText
                  classes={{ primary: classes.hakuTulosListItemText }}
                  id={labelId}
                  primary={
                    <Grid container justify="space-between" wrap="nowrap">
                      <Grid item>
                        {kouutusalaArray[1].nimi?.[i18n.language]}
                      </Grid>
                      <Grid item>{`(${kouutusalaArray[1]?.count})`}</Grid>
                    </Grid>
                  }
                />
              </ListItem>
            );
          })}
        </List>
        <KoulutuksetTaso2 />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
});

const KoulutusalatSuodatinWithStyles = withTranslation()(
  withStyles(styles)(KoulutusalatSuodatin)
);

export default withRouter(KoulutusalatSuodatinWithStyles);