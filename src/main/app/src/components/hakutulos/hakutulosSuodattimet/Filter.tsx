import { Grid, List, ListItem, ListItemIcon, makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Localizer as l } from '#/src/tools/Utils';
import { Translateable } from '#/src/types/common';
import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinCheckbox,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import { SummaryContent } from './SummaryContent';

const withStyles = makeStyles(() => ({
  noBoxShadow: {
    boxShadow: 'none',
  },
}));

type ElasticTuple = [string, { count: number; nimi: Translateable }];
type Props = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
  sortedFilterValues: ElasticTuple[];
  handleCheck: (value: ElasticTuple) => () => void;
  checkedStr?: string;
  checkedValues: Array<{ id: string }>;
};

export const Filter = ({
  expanded,
  elevation,
  displaySelected = false,
  summaryHidden = false,
  sortedFilterValues,
  handleCheck,
  checkedStr,
  checkedValues,
}: Props) => {
  const classes = withStyles();
  const { t } = useTranslation();

  return (
    <SuodatinAccordion
      {...(summaryHidden && { className: classes.noBoxShadow })}
      elevation={elevation}
      defaultExpanded={expanded}>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            selectedFiltersStr={checkedStr}
            maxCharLengthBeforeChipWithNumber={20}
            filterName={t('haku.opetuskieli')}
            displaySelected={displaySelected}
          />
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <List style={{ width: '100%' }}>
          {sortedFilterValues.map((dataTuple) => {
            const [id, data] = dataTuple;
            const labelId = `language-list-label-${id}`;
            return (
              <ListItem key={id} dense button onClick={handleCheck(dataTuple)}>
                <ListItemIcon>
                  <SuodatinCheckbox
                    edge="start"
                    checked={checkedValues.some((v) => v.id === id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <SuodatinListItemText
                  id={labelId}
                  primary={
                    <Grid container justify="space-between" wrap="nowrap">
                      <Grid item>{l.localize(data)}</Grid>
                      <Grid item>{`(${data?.count})`}</Grid>
                    </Grid>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
