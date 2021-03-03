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

  const getAsString = useCallback(() => qs.stringify(C.cleanRequestParams(search)), [
    search,
  ]);

  const updateUrlSearchParams = useCallback(
    (updatedProps: object, resetPages = true) => {
      const newSearch = {
        ...search,
        ...updatedProps,
        ...(resetPages ? { kpage: 1, opage: 1 } : {}),
      };
      history.replace({ search: qs.stringify(C.cleanRequestParams(newSearch)) });
    },
    [history, search]
  );

  const isDraft = useMemo(() => !!search?.draft, [search]);

  return {
    isDraft,
    search,
    getAsString,
    updateUrlSearchParams,
  };
};
