import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
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
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelSummary,
  SuodatinExpansionPanelDetails,
} from './SuodatinExpansionPanel';

const KoulutusTyyppiSuodatin = observer((props) => {
  const { classes, i18n, history, t } = props;
  const { hakuStore } = useStores();
  const { koulutusFilters, oppilaitosFilters, toggle, filter } = hakuStore;
  const { koulutustyyppi } = filter;

  const [koulutusTyypit, setKoulutusTyypit] = useState({});
  const [valitutKoulutusTyypit, setValitutKoulutusTyypit] = useState([]);

  useEffect(() => {
    const koulutusTyypitJS =
      toggle === 'koulutus'
        ? toJS(koulutusFilters.koulutusTyyppi)
        : toJS(oppilaitosFilters.koulutusTyyppi);
    setKoulutusTyypit(koulutusTyypitJS);
    setValitutKoulutusTyypit(toJS(koulutustyyppi));
  }, [
    hakuStore,
    koulutusFilters.koulutusTyyppi,
    koulutustyyppi,
    oppilaitosFilters.koulutusTyyppi,
    props,
    toggle,
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
    search.koulutustyyppi = newValitutKoulutusTyypit
      .map(({ id }) => id)
      .join(',');
    search.kpage = 1;
    search.opage = 1;
    hakuStore.setKoulutusTyyppiFilter(newValitutKoulutusTyypit);
    history.replace({ search: qs.stringify(search) });
    hakuStore.clearOffsetAndPaging();
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  return (
    <SuodatinExpansionPanel defaultExpanded={true}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography variant="subtitle1">{t('haku.koulutustyyppi')}</Typography>
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
                    <Checkbox
                      classes={{ root: classes.listItemCheckbox }}
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
                  <ListItemText
                    classes={{ primary: classes.hakuTulosListItemText }}
                    id={labelId}
                    primary={
                      <Grid container justify="space-between" wrap="nowrap">
                        <Grid item>{eduTypeOuterArr[1].nimi.fi}</Grid>
                        <Grid item>{`(${eduTypeOuterArr[1].count})`}</Grid>
                      </Grid>
                    }></ListItemText>
                </ListItem>
                {eduTypeOuterArr[1].alakoodit &&
                  Object.entries(eduTypeOuterArr[1].alakoodit).map(
                    (eduTypeInnerArr) => {
                      return (
                        <ListItem
                          className={classes.eduTypeInnerListPadding}
                          key={`${eduTypeOuterArr[0]}_${eduTypeInnerArr[0]}`}
                          id={`${eduTypeOuterArr[0]}_${eduTypeInnerArr[0]}`}
                          dense
                          button
                          onClick={handleEduTypeToggle(eduTypeInnerArr)}
                          disabled={eduTypeInnerArr[1].count === 0}>
                          <ListItemIcon>
                            <Checkbox
                              classes={{ root: classes.listItemCheckbox }}
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
                          <ListItemText
                            classes={{ primary: classes.hakuTulosListItemText }}
                            id={`this ${labelId}_${eduTypeInnerArr}`}
                            primary={
                              <Grid
                                container
                                justify="space-between"
                                wrap="nowrap">
                                <Grid item>
                                  {eduTypeInnerArr[1]?.nimi?.[i18n.language]}
                                </Grid>
                                <Grid item>
                                  {`(${eduTypeInnerArr[1]?.count})`}
                                </Grid>
                              </Grid>
                            }></ListItemText>
                        </ListItem>
                      );
                    }
                  )}
              </React.Fragment>
            );
          })}
        </List>
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
});

const KoulutusTyyppiSuodatinWithStyles = withTranslation()(
  withStyles(styles)(KoulutusTyyppiSuodatin)
);

export default withRouter(KoulutusTyyppiSuodatinWithStyles);
