import React from 'react';

import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
} from '@material-ui/core';
import { ExpandMore, SearchOutlined } from '@material-ui/icons';
import Select, { components } from 'react-select';

import { colors } from '#/src/colors';
import { Localizer as l } from '#/src/tools/Utils';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinCheckbox,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import { SummaryContent } from './SummaryContent';
import { FilterType } from './SuodatinTypes';

type Styles = React.ComponentProps<typeof Select>['styles'];
const customStyles: Styles = {
  control: (provided) => ({
    ...provided,
    minHeight: '34px',
    borderRadius: '2px',
    cursor: 'text',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    padding: '6px',
  }),
};

// Overridden react-select components

const LoadingIndicator = () => <CircularProgress size={25} color="inherit" />;

type RSDropdownIndicatorProps = React.ComponentProps<typeof components.DropdownIndicator>;
const DropdownIndicator = (props: RSDropdownIndicatorProps) => (
  <components.DropdownIndicator {...props}>
    <SearchOutlined />
  </components.DropdownIndicator>
);

type RSOptionProps = React.ComponentProps<typeof components.Option>;
type OptionProps = {
  data?: { label: string; checked: boolean };
  innerProps: RSOptionProps['innerProps'];
  isFocused: boolean;
};
const Option = ({ data, innerProps, isFocused }: OptionProps) => (
  // innerProps contain interaction functions e.g. onClick
  <ListItem dense button {...innerProps} selected={isFocused}>
    <SuodatinCheckbox
      checked={data?.checked}
      disableRipple
      role="presentation"
      style={{ pointerEvents: 'none' }}
    />
    {data?.label}
  </ListItem>
);

const withStyles = makeStyles(() => ({
  noBoxShadow: {
    boxShadow: 'none',
  },
}));

type Props = {
  name: string;
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
  sortedFilterValues: Array<FilterType>;
  handleCheck: (value: FilterType) => void;
  checkedStr?: string;
  checkedValues: Array<{ id: string }>;
  options?: any;
  selectPlaceholder?: string;
};

// NOTE: Do *not* put redux code here, this component is used both with and without
export const Filter = ({
  name,
  expanded,
  elevation,
  displaySelected = false,
  summaryHidden = false,
  sortedFilterValues,
  handleCheck,
  checkedStr,
  checkedValues,
  options,
  selectPlaceholder,
}: Props) => {
  const classes = withStyles();
  const loading = false;

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
            filterName={name}
            displaySelected={displaySelected}
          />
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container direction="column">
          {options && (
            <Grid item style={{ padding: '20px 0' }}>
              <Select
                components={{ DropdownIndicator, LoadingIndicator, Option }}
                styles={customStyles}
                value=""
                isLoading={loading}
                name="district-search"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder={selectPlaceholder}
                onChange={handleCheck}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: colors.darkGrey,
                    primary: colors.brandGreen,
                  },
                })}
              />
            </Grid>
          )}
          <Grid item>
            <List style={{ width: '100%' }}>
              {sortedFilterValues.map((value) => {
                const { id, count } = value;
                const labelId = `language-list-label-${id}`;
                return (
                  <ListItem key={id} dense button onClick={() => handleCheck(value)}>
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
                          <Grid item>{l.localize(value)}</Grid>
                          <Grid item>{`(${count})`}</Grid>
                        </Grid>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
