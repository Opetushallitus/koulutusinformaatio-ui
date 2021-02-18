import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { searchAllOnPageReload } from '#/src/store/reducers/hakutulosSlice';
import { getAPIRequestParams } from '#/src/store/reducers/hakutulosSliceSelector';

import { Hakutulos } from '../hakutulos/Hakutulos';
import { useUrlParams } from '../hakutulos/UseUrlParams';

export const Haku = () => {
  const { search } = useUrlParams();

  // TODO: keyword should probably be refactored into url params since hakupalkki is found in other pages too
  // Or into sessiontstorage?
  const { keyword } = useParams<{ keyword: string }>();
  const apiRequestParams = useSelector(getAPIRequestParams);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(searchAllOnPageReload({ apiRequestParams, search, keyword }));
  });

  return <Hakutulos />;
};
