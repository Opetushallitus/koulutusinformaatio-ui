import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Checkbox,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Grid,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';
import { styles } from '../../../styles';
import { useStores } from '../../../hooks';

const OpetusKieliSuodatin = observer((props) => {
  const { classes, i18n, history } = props;
  const { hakuStore } = useStores();
  const { koulutusFilters, oppilaitosFilters, toggle } = hakuStore;

  const [opetusKieli, setOpetusKieli] = useState({});
  const [valitutOpetusKielet, setValitutOpetusKielet] = useState([]);

  useEffect(() => {
    toggle === 'koulutus'
      ? setOpetusKieli(koulutusFilters.opetusKieli)
      : setOpetusKieli(oppilaitosFilters.opetusKieli);
  }, [
    koulutusFilters.opetusKieli,
    oppilaitosFilters.opetusKieli,
    props,
    toggle,
  ]);

  const handleLanguageToggle = (kieliId) => () => {
    const currentIndex = valitutOpetusKielet.indexOf(kieliId);
    const newValitutOpetusKielet = [...valitutOpetusKielet];

    if (currentIndex === -1) {
      newValitutOpetusKielet.push(kieliId);
    } else {
      newValitutOpetusKielet.splice(currentIndex, 1);
    }

    setValitutOpetusKielet(newValitutOpetusKielet);
    const search = qs.parse(history.location.search);
    search.opetuskieli = newValitutOpetusKielet.join(',');
    hakuStore.setOpetusKieliFilter(newValitutOpetusKielet);
    history.replace({ search: qs.stringify(search) });
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  return (
    <ExpansionPanel defaultExpanded={true}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">Opetuskieli</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <List style={{ width: '100%' }}>
          {Object.keys(opetusKieli).map((opetuskieliKey) => {
            const labelId = `language-list-label-${opetuskieliKey}`;
            return (
              <ListItem
                key={opetuskieliKey}
                dense
                button
                onClick={handleLanguageToggle(opetuskieliKey)}
                disabled={opetusKieli[opetuskieliKey].count === 0}
              >
                <ListItemIcon>
                  <Checkbox
                    classes={{ root: classes.listItemCheckbox }}
                    edge="start"
                    checked={valitutOpetusKielet.indexOf(opetuskieliKey) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.hakuTulosListItemText }}
                  id={labelId}
                  primary={
                    <Grid container justify="space-between">
                      <Grid item>
                        {opetusKieli[opetuskieliKey].nimi[i18n.language]}
                      </Grid>
                      <Grid
                        item
                      >{`(${opetusKieli[opetuskieliKey].count})`}</Grid>
                    </Grid>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
});

const OpetusKieliSuodatinWithStyles = withTranslation()(
  withStyles(styles)(OpetusKieliSuodatin)
);

export default withRouter(OpetusKieliSuodatinWithStyles);
