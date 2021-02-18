import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearPaging,
  searchAll,
  setOpetuskieli,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getOpetuskieliFilterProps,
} from '#/src/store/reducers/hakutulosSliceSelector';

import { useUrlParams } from '../UseUrlParams';
import { Filter } from './Filter';
import { FilterType, OpetuskieliFilterProps, SuodatinProps } from './SuodatinTypes';

export const OpetuskieliSuodatin = (filterProps: SuodatinProps) => {
  const { t } = useTranslation();
  const { updateUrlSearchParams } = useUrlParams();
  const dispatch = useDispatch();
  const opetuskieliFilterProps = useSelector(getOpetuskieliFilterProps);
  const {
    sortedOpetuskielet,
    checkedOpetuskielet,
    checkedOpetuskieletStr,
  }: OpetuskieliFilterProps = opetuskieliFilterProps as any;
  const apiRequestParams = useSelector(getAPIRequestParams);

  const handleCheck = (opetuskieliObj: FilterType) => {
    const checkedOpetuskieliObj = {
      id: opetuskieliObj.id,
      name: opetuskieliObj.nimi,
    };
    const currentIndex = checkedOpetuskielet.findIndex(
      ({ id }) => id === checkedOpetuskieliObj.id
    );
    const newCheckedOpetuskielet: any = [...checkedOpetuskielet];

    if (currentIndex === -1) {
      newCheckedOpetuskielet.push(checkedOpetuskieliObj);
    } else {
      newCheckedOpetuskielet.splice(currentIndex, 1);
    }
    const newCheckedOpetusKieletStr = newCheckedOpetuskielet
      .map(({ id }: any) => id)
      .join(',');

    dispatch(setOpetuskieli({ newCheckedOpetuskielet }));
    updateUrlSearchParams({ opetuskieli: newCheckedOpetusKieletStr });
    dispatch(clearPaging());
    dispatch(searchAll({ ...apiRequestParams, opetuskieli: newCheckedOpetusKieletStr }));
  };

  const sortedValues = useMemo(
    () => sortedOpetuskielet.map(([id, values]) => ({ id, ...values })),
    [sortedOpetuskielet]
  );

  return (
    <Filter
      {...filterProps}
      name={t('haku.opetuskieli')}
      sortedFilterValues={sortedValues}
      handleCheck={handleCheck}
      checkedStr={checkedOpetuskieletStr}
      checkedValues={checkedOpetuskielet}
    />
  );
};
