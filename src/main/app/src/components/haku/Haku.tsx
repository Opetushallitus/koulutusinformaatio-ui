import React, { useEffect, useRef } from 'react';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';

import { searchAllOnPageReload } from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getIsInitialized,
} from '#/src/store/reducers/hakutulosSliceSelector';

import { Hakutulos } from '../hakutulos/Hakutulos';
import { useUrlParams } from '../hakutulos/UseUrlParams';

export const Haku = () => {
  const { search, updateUrlSearchParams } = useUrlParams();

  // TODO: keyword should probably be refactored into url params since hakupalkki is found in other pages too
  const { keyword } = useParams<{ keyword: string }>();
  const queryParams = useSelector(getAPIRequestParams, shallowEqual);
  const initialized = useSelector(getIsInitialized);
  const dispatch = useDispatch();

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      dispatch(searchAllOnPageReload({ search, keyword }));
    }
  });

  // Update queryparameters when any haku api -request related parameters change
  useEffect(() => {
    if (initialized) {
      updateUrlSearchParams(queryParams);
    }
  }, [initialized, queryParams, updateUrlSearchParams]);

  return <Hakutulos />;
};
