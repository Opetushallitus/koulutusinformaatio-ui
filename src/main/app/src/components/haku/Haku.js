import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import qs from 'query-string';
import Hakutulos from '../hakutulos/Hakutulos';
import { getAPIRequestParams } from '#/src/store/reducers/hakutulosSliceSelector';
import { searchAllOnPageReload } from '#/src/store/reducers/hakutulosSlice';

const Haku = () => {
  const history = useHistory();
  const { keyword } = useParams();
  const apiRequestParams = useSelector(getAPIRequestParams);
  const dispatch = useDispatch();

  useEffect(() => {
    const search = qs.parse(history.location.search, { parseNumbers: true });
    dispatch(searchAllOnPageReload({ apiRequestParams, search, keyword }));
  });

  return <Hakutulos />;
};

export default Haku;
