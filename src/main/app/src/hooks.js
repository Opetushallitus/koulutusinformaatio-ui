import React, { useCallback } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';

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
