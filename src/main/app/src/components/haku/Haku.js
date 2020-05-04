import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import qs from 'query-string';
import _ from 'lodash';
import Hakutulos from '../hakutulos/Hakutulos';
import { getAPIRequestParams } from '#/src/reducers/hakutulosSliceSelector';
import { searchAll, setKeyword } from '#/src/reducers/hakutulosSlice';
import { FILTER_TYPES } from '#/src/constants';
import { Common as C } from '#/src/tools/Utils';

const Haku = () => {
  const history = useHistory();
  const { keyword } = useParams();
  const apiRequestParams = useSelector(getAPIRequestParams);
  const keywordEditMode = useSelector((state) => state.hakutulos.keywordEditMode);
  const dispatch = useDispatch();

  function getSortedSearch(search) {
    return _.entries(_.pick(search, _.keys(apiRequestParams))).reduce((result, entry) => {
      if (_.includes(FILTER_TYPES, entry[0])) {
        return {
          ...result,
          [entry[0]]: _.join(_.sortBy(_.split(entry[1], ',')), ','),
        };
      } else {
        return { ...result, [entry[0]]: entry[1] };
      }
    }, {});
  }

  useEffect(() => {
    const search = getSortedSearch(
      qs.parse(history.location.search, { parseNumbers: true })
    );
    if (!_.isMatch(apiRequestParams, { ...search, keyword }) && !keywordEditMode) {
      let newSearch = C.withoutNilValues({ ...apiRequestParams, keyword, ...search });
      dispatch(setKeyword({ keyword }));
      dispatch(searchAll(newSearch, true, true));
    }
  });

  return <Hakutulos />;
};

export default Haku;
