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
  FilterValue,
  OpetuskieliFilterProps,
  SuodatinComponentProps,
} from './SuodatinTypes';

const OPETUSKIELI_FILTER_ID = 'opetuskieli';

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

  const handleCheck = (opetuskieliObj: FilterValue) => {
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

  const values = useMemo(
    () =>
      sortedOpetuskielet.map(([id, values]) => ({
        id,
        ...values,
        filterId: OPETUSKIELI_FILTER_ID,
        checked: checkedOpetuskielet.some((v) => v.id === id),
      })),
    [checkedOpetuskielet, sortedOpetuskielet]
  );

  return (
    <Filter
      {...props}
      name={t('haku.opetuskieli')}
      values={values}
      handleCheck={handleCheck}
      checkedStr={checkedOpetuskieletStr}
    />
  );
};
