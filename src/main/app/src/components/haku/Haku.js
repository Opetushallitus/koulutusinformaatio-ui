import React, { useEffect } from 'react';
import parse from 'url-parse';
import { observer } from 'mobx-react';
import Hakutulos from '../hakutulos/Hakutulos';
import { useLocation, useParams } from 'react-router-dom';
import { useStores } from '../../hooks';

const Haku = () => {
  const { hakuStore, hakuehtoStore } = useStores();
  const location = useLocation();
  const { keyword } = useParams();

  useEffect(() => {
    const search = parse(location.search);
    hakuStore.setAll(keyword, search);
    hakuehtoStore.setAll(keyword, search);
  }, [hakuStore, hakuehtoStore, keyword, location.search]);

  return <Hakutulos />;
};

export default observer(Haku);
