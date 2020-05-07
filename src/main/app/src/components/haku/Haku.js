import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import qs from 'query-string';
import _ from 'lodash';
import Hakutulos from '../hakutulos/Hakutulos';
import { getAPIRequestParams } from '#/src/store/reducers/hakutulosSliceSelector';
import { searchAll, setKeyword } from '#/src/store/reducers/hakutulosSlice';
import { FILTER_TYPES_ARR } from '#/src/constants';
import { Common as C } from '#/src/tools/Utils';

const Haku = () => {
  const history = useHistory();
  const { keyword } = useParams();
  const apiRequestParams = useSelector(getAPIRequestParams);
  const keywordEditMode = useSelector((state) => state.hakutulos.keywordEditMode);
  const dispatch = useDispatch();

  function getSortedSearch(search) {
    return _.mapValues(_.pick(search, _.keys(apiRequestParams)), (value, key) =>
      _.includes(FILTER_TYPES_ARR, key)
        ? _.join(_.sortBy(_.split(value, ',')), ',')
        : value
    );
  }

  useEffect(() => {
    const search = getSortedSearch(
      qs.parse(history.location.search, { parseNumbers: true })
    );
    if (!_.isMatch(apiRequestParams, { ...search, keyword }) && !keywordEditMode) {
      let newSearch = C.cleanRequestParams({ ...apiRequestParams, keyword, ...search });
      dispatch(setKeyword({ keyword }));
      dispatch(searchAll(newSearch, true, true));
    }
  });

  return <Hakutulos />;
};

export default Haku;
