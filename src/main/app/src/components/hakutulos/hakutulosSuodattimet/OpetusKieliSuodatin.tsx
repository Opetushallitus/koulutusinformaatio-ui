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

import { Filter } from './Filter';
import {
  FilterType,
  OpetuskieliFilterProps,
  SuodatinComponentProps,
} from './SuodatinTypes';

export const OpetuskieliSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
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
    dispatch(clearPaging());
    dispatch(searchAll({ ...apiRequestParams, opetuskieli: newCheckedOpetusKieletStr }));
  };

  const sortedValues = useMemo(
    () => sortedOpetuskielet.map(([id, values]) => ({ id, ...values })),
    [sortedOpetuskielet]
  );

  return (
    <Filter
      {...props}
      name={t('haku.opetuskieli')}
      sortedFilterValues={sortedValues}
      handleCheck={handleCheck}
      checkedStr={checkedOpetuskieletStr}
      checkedValues={checkedOpetuskielet}
    />
  );
};
