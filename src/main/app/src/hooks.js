import { MobXProviderContext } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

export const useQueryParams = () => {
  const apiRequestParams = useSelector(getAPIRequestParams);
  const { i18n } = useTranslation();
  const lng = useMemo(() => i18n.language, [i18n.language]);

  return { ...apiRequestParams, lng };
};
