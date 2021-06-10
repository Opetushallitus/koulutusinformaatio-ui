import { useCallback, useMemo } from 'react';

import qs from 'query-string';
import { useHistory } from 'react-router-dom';

import { Common as C } from '#/src/tools/Utils';

export const useUrlParams = () => {
  const history = useHistory();
  const search = useMemo(
    () => qs.parse(history.location.search, { parseNumbers: true }),
    [history.location.search]
  );

  const updateUrlSearchParams = useCallback(
    (updatedProps: object) => {
      history.replace({ search: qs.stringify(C.cleanRequestParams(updatedProps)) });
    },
    [history]
  );

  const isDraft = useMemo(() => !!search?.draft, [search]);

  return {
    isDraft,
    search,
    updateUrlSearchParams,
  };
};
