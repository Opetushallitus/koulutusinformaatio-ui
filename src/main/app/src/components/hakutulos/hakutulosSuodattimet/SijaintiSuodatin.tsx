import React, { useMemo } from 'react';

import { CircularProgress, ListItem } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';

import { colors } from '#/src/colors';
import {
  handleFilterOperations,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps, getIsReady } from '#/src/store/reducers/hakutulosSliceSelector';
import { localize } from '#/src/tools/localization';

import { KonfoCheckbox } from './CustomizedMuiComponents';
import { Filter } from './Filter';
import { FilterProps, FilterValue, SuodatinComponentProps } from './SuodatinTypes';

type Styles = React.ComponentProps<typeof Select>['styles'];
const customStyles: Styles = {
  control: (provided) => ({
    ...provided,
    minHeight: '34px',
    borderRadius: '2px',
    cursor: 'text',
    marginBottom: '12px',
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

const MAAKUNTA_FILTER_ID = 'maakunta';
const KUNTA_FILTER_ID = 'kunta';
const maakuntaSelector = getFilterProps(MAAKUNTA_FILTER_ID);
const kuntaSelector = getFilterProps(KUNTA_FILTER_ID);

const getSelectOption = (value: FilterValue, isMaakunta: boolean) => ({
  ...value,
  label: `${localize(value)} (${value.count})`,
  value: localize(value),
  isMaakunta,
  name: value.nimi, // TODO: tarviiko tätä?
});

const SijaintiSelect = ({
  isLoading,
  options,
  handleCheck,
}: Pick<
  React.ComponentProps<typeof Select>,
  'isLoading' | 'options' | 'handleCheck'
>) => {
  const { t } = useTranslation();
  return (
    <Select
      components={{ DropdownIndicator, LoadingIndicator, Option }}
      styles={customStyles}
      value=""
      isLoading={isLoading}
      name="district-search"
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder={t('haku.etsi-paikkakunta-tai-alue')}
      onChange={(e) => handleCheck(e)}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: colors.darkGrey,
          primary: colors.brandGreen,
        },
      })}
    />
  );
};

export const SijaintiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    values: kuntaValues,
    localizedCheckedValues: localizedKuntaValues,
  } = useSelector<any, FilterProps>(kuntaSelector);
  const {
    values: maakuntaValues,
    localizedCheckedValues: localizedMaakuntaValues,
  } = useSelector<any, FilterProps>(maakuntaSelector);

  const loading = !useSelector(getIsReady);

  const handleCheck = (item: FilterValue) => {
    dispatch(handleFilterOperations([{ item, operation: 'TOGGLE' }]));
    dispatch(newSearchAll());
  };

  const groupedSijainnit = useMemo(
    () => [
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: _fp.sortBy('label')(
          kuntaValues.filter((v) => v.count > 0).map((v) => getSelectOption(v, false))
        ),
      },
      {
        label: t('haku.maakunnat'),
        options: _fp.sortBy('label')(
          maakuntaValues.filter((v) => v.count > 0).map((v) => getSelectOption(v, true))
        ),
      },
    ],
    [kuntaValues, maakuntaValues, t]
  );

  const usedLocalizedCheckedValues = [localizedKuntaValues, localizedMaakuntaValues]
    .filter(Boolean)
    .join(', ');

  return (
    <Filter
      {...props}
      name={t('haku.sijainti')}
      values={maakuntaValues}
      handleCheck={handleCheck}
      checkedStr={usedLocalizedCheckedValues}
      expandValues
      additionalContent={
        <SijaintiSelect
          isLoading={loading}
          handleCheck={handleCheck}
          options={groupedSijainnit}
        />
      }
    />
  );
};
