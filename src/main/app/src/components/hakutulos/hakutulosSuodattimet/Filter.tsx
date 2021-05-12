import React from 'react';

import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
} from '@material-ui/core';
import {
  ExpandMore,
  IndeterminateCheckBoxOutlined,
  SearchOutlined,
} from '@material-ui/icons';
import _ from 'lodash';
import Select, { components } from 'react-select';

import { colors } from '#/src/colors';
import { localize } from '#/src/tools/localization';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  KonfoCheckbox,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import { SummaryContent } from './SummaryContent';
import { FilterValue } from './SuodatinTypes';

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
    <KonfoCheckbox
      checked={data?.checked}
      disableRipple
      role="presentation"
      style={{ pointerEvents: 'none' }}
    />
    {data?.label}
  </ListItem>
);

const withStyles = makeStyles((theme) => ({
  noBoxShadow: {
    boxShadow: 'none',
  },
  intendedCheckbox: {
    paddingLeft: theme.spacing(2.2),
  },
}));

type Props = {
  name: string;
  testId?: string;
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;

  values: Array<FilterValue>;
  handleCheck: (value: FilterValue) => void;
  checkedStr?: string;
  options?: any;
  selectPlaceholder?: string;
  additionalContent?: JSX.Element;
};

// NOTE: Do *not* put redux code here, this component is used both with and without
export const Filter = ({
  name,
  testId,
  expanded,
  elevation,
  displaySelected = false,
  summaryHidden = false,
  values,
  handleCheck,
  checkedStr,
  options,
  selectPlaceholder,
  additionalContent,
}: Props) => {
  const classes = withStyles();
  const loading = false;

  return (
    <SuodatinAccordion
      {...(summaryHidden && { className: classes.noBoxShadow })}
      data-cy={testId}
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
          {additionalContent}
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
              {values.map((value) => {
                const { id, checked, count, intended, indeterminate } = value;
                const labelId = `language-list-label-${id}`;
                return (
                  <ListItem
                    key={id}
                    dense
                    button
                    onClick={() => handleCheck(value)}
                    className={intended ? classes.intendedCheckbox : ''}>
                    <ListItemIcon>
                      <KonfoCheckbox
                        edge="start"
                        checked={checked}
                        indeterminateIcon={<IndeterminateCheckBoxOutlined />}
                        indeterminate={indeterminate}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <SuodatinListItemText
                      id={labelId}
                      primary={
                        <Grid container justify="space-between" wrap="nowrap">
                          <Grid item>
                            {_.isString(value.nimi) ? value.nimi : localize(value)}
                          </Grid>
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
