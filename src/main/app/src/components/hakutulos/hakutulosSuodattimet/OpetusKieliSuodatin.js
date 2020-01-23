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

  const [opetusKieli, setOpetusKieli] = useState({});
  const [valitutOpetusKielet, setValitutOpetusKielet] = useState([]);

  useEffect(() => {
    toggle === 'koulutus'
      ? setOpetusKieli(toJS(koulutusFilters.opetusKieli))
      : setOpetusKieli(toJS(oppilaitosFilters.opetusKieli));
    setValitutOpetusKielet(toJS(opetuskieli));
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
    const currentIndex = valitutOpetusKielet.findIndex(
      ({ id }) => id === opetuskieliFilterObj.id
    );
    const newValitutOpetusKielet = [...valitutOpetusKielet];

    if (currentIndex === -1) {
      newValitutOpetusKielet.push(opetuskieliFilterObj);
    } else {
      newValitutOpetusKielet.splice(currentIndex, 1);
    }

    setValitutOpetusKielet(newValitutOpetusKielet);
    const search = qs.parse(history.location.search);
    search.opetuskieli = newValitutOpetusKielet.map(({ id }) => id).join(',');
    search.kpage = 1;
    search.opage = 1;
    hakuStore.setOpetusKieliFilter(newValitutOpetusKielet);
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
          {Object.entries(opetusKieli).map((opetuskieliArr) => {
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
                      valitutOpetusKielet.find(
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
