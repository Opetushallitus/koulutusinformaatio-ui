import React, { useCallback, useMemo } from 'react';

import { MobXProviderContext } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { getAPIRequestParams } from '#/src/store/reducers/hakutulosSliceSelector';

export const useStores = () => React.useContext(MobXProviderContext);

export const useLanguageState = () => {
  const location = useLocation();
  const history = useHistory();
  const lng = location.pathname.match(/^\/(.*?)(\/|$)/)?.[1];

  const setLanguage = useCallback(
    (newLang) => {
      if (lng && newLang !== lng) {
        const newPath = location.pathname.replace(new RegExp(`^/${lng}`), `/${newLang}`);
        history.push({
          pathname: newPath,
        });
      }
    },
    [history, location, lng]
  );
  return [lng, setLanguage];
};

// Load asynchronous data once and then cache it forever
export const useQueryOnce = (key, fn, props) => {
  return useQuery(key, () => fn(props), {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

export const useQueryParams = () => {
  const apiRequestParams = useSelector(getAPIRequestParams);
  const { i18n } = useTranslation();
  const lng = useMemo(() => i18n.language, [i18n.language]);

  return { ...apiRequestParams, lng };
};
