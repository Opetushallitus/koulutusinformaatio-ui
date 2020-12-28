import React from 'react';
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
import { ElasticTuple, OpetuskieliFilterProps, SuodatinProps } from './SuodatinTypes';
import { useUrlParams } from '../UseUrlParams';

export const OpetuskieliSuodatin = (filterProps: SuodatinProps) => {
  const { updateUrlSearchParams } = useUrlParams();
  const dispatch = useDispatch();
  const opetuskieliFilterProps = useSelector(getOpetuskieliFilterProps);
  const {
    sortedOpetuskielet,
    checkedOpetuskielet,
    checkedOpetuskieletStr,
  }: OpetuskieliFilterProps = opetuskieliFilterProps as any;
  const apiRequestParams = useSelector(getAPIRequestParams);

  const handleCheck = (opetuskieliObj: ElasticTuple) => () => {
    const checkedOpetuskieliObj = {
      id: opetuskieliObj[0],
      name: opetuskieliObj[1]?.nimi,
    };
    const currentIndex = checkedOpetuskielet.findIndex(
      ({ id }) => id === checkedOpetuskieliObj.id
    );
    const newCheckedOpetuskielet = [...checkedOpetuskielet];

    if (currentIndex === -1) {
      newCheckedOpetuskielet.push(checkedOpetuskieliObj);
    } else {
      newCheckedOpetuskielet.splice(currentIndex, 1);
    }
    const newCheckedOpetusKieletStr = newCheckedOpetuskielet
      .map(({ id }) => id)
      .join(',');

    dispatch(setOpetuskieli({ newCheckedOpetuskielet }));
    updateUrlSearchParams({ opetuskieli: newCheckedOpetusKieletStr });
    dispatch(clearPaging());
    dispatch(searchAll({ ...apiRequestParams, opetuskieli: newCheckedOpetusKieletStr }));
  };

  return (
    <Filter
      {...filterProps}
      sortedFilterValues={sortedOpetuskielet}
      handleCheck={handleCheck}
      checkedStr={checkedOpetuskieletStr}
      checkedValues={checkedOpetuskielet}
    />
  );
};
