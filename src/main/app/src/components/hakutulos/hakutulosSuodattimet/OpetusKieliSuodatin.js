import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Checkbox,
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
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelSummary,
  SuodatinExpansionPanelDetails,
} from './SuodatinExpansionPanel';

const OpetusKieliSuodatin = observer((props) => {
  const { classes, i18n, history, t } = props;
  const { hakuStore } = useStores();
  const { koulutusFilters, oppilaitosFilters, toggle, filter } = hakuStore;
  const { opetuskieli } = filter;

  const [opetusKielet, setOpetusKielet] = useState([]);
  const [checkedOpetusKielet, setCheckedOpetusKielet] = useState([]);

  useEffect(() => {
    const _opetusKielet =
      toggle === 'koulutus'
        ? Object.entries(toJS(koulutusFilters.opetusKieli))
        : Object.entries(toJS(oppilaitosFilters.opetusKieli));

    _opetusKielet.sort((a, b) => (a[1].nimi.fi > b[1].nimi.fi ? 1 : -1));
    _opetusKielet.sort((a, b) => b[1].count - a[1].count);
    const _muuKieliIndex = _opetusKielet.findIndex(
      (el) => el[0] === 'oppilaitoksenopetuskieli_9'
    );

    if (_muuKieliIndex !== -1) {
      _opetusKielet.push(_opetusKielet.splice(_muuKieliIndex, 1)[0]);
    }

    setOpetusKielet(_opetusKielet);
    setCheckedOpetusKielet(toJS(opetuskieli));
  }, [
    props,
    toggle,
    opetuskieli,
    koulutusFilters.opetusKieli,
    oppilaitosFilters.opetusKieli,
  ]);

  const handleLanguageToggle = (opetuskieliObj) => () => {
    const opetuskieliFilterObj = {
      id: opetuskieliObj[0],
      name: opetuskieliObj[1]?.nimi,
    };
    const currentIndex = checkedOpetusKielet.findIndex(
      ({ id }) => id === opetuskieliFilterObj.id
    );
    const newCheckedOpetusKielet = [...checkedOpetusKielet];

    if (currentIndex === -1) {
      newCheckedOpetusKielet.push(opetuskieliFilterObj);
    } else {
      newCheckedOpetusKielet.splice(currentIndex, 1);
    }

    setCheckedOpetusKielet(newCheckedOpetusKielet);
    const search = qs.parse(history.location.search);
    search.opetuskieli = newCheckedOpetusKielet.map(({ id }) => id).join(',');
    search.kpage = 1;
    search.opage = 1;
    hakuStore.setOpetusKieliFilter(newCheckedOpetusKielet);
    hakuStore.clearOffsetAndPaging();
    history.replace({ search: qs.stringify(search) });
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  return (
    <SuodatinExpansionPanel defaultExpanded={true}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">{t('haku.opetuskieli')}</Typography>
      </SuodatinExpansionPanelSummary>
      <SuodatinExpansionPanelDetails>
        <List style={{ width: '100%' }}>
          {opetusKielet.map((opetuskieliArr) => {
            const labelId = `language-list-label-${opetuskieliArr[0]}`;
            return (
              <ListItem
                key={opetuskieliArr[0]}
                dense
                button
                onClick={handleLanguageToggle(opetuskieliArr)}
                disabled={opetuskieliArr[1].count === 0}>
                <ListItemIcon>
                  <Checkbox
                    classes={{ root: classes.listItemCheckbox }}
                    edge="start"
                    checked={
                      checkedOpetusKielet.find(
                        ({ id }) => id === opetuskieliArr[0]
                      ) !== undefined
                    }
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.hakuTulosListItemText }}
                  id={labelId}
                  primary={
                    <Grid container justify="space-between" wrap="nowrap">
                      <Grid item>
                        {opetuskieliArr[1]?.nimi?.[i18n.language]}
                      </Grid>
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
});

const OpetusKieliSuodatinWithStyles = withTranslation()(
  withStyles(styles)(OpetusKieliSuodatin)
);

export default withRouter(OpetusKieliSuodatinWithStyles);
