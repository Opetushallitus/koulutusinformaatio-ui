import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import qs from 'query-string';
import Hakutulos from '../hakutulos/Hakutulos';
import { searchAllOnPageReload } from '#/src/store/reducers/hakutulosSlice';
import { useQueryParams } from '#/src/hooks';

const Haku = () => {
  const history = useHistory();
  const { keyword } = useParams();
  const apiRequestParams = useQueryParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const search = qs.parse(history.location.search, { parseNumbers: true });
    dispatch(searchAllOnPageReload({ apiRequestParams, search, keyword }));
  });

  return <Hakutulos />;
};

export default Haku;
