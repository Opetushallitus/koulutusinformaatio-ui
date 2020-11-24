import React from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import KoulutusKortti from './hakutulosKortit/KoulutusKortti';
import OppilaitosKortti from './hakutulosKortit/OppilaitosKortti';
import EmptyResult from '#/src/components/common/EmptyResult';

const HakutulosResults = ({ selectedTab, koulutusHits, oppilaitosHits, keyword }) => {
  const { t } = useTranslation();

  if (selectedTab === 'koulutus' && _.size(koulutusHits) > 0) {
    return koulutusHits.map((koulutus) => {
      return <KoulutusKortti key={koulutus.oid} koulutus={koulutus} />;
    });
  }
  if (selectedTab === 'oppilaitos' && _.size(oppilaitosHits) > 0) {
    return oppilaitosHits.map((oppilaitos) => {
      return <OppilaitosKortti key={oppilaitos.oid} oppilaitos={oppilaitos} />;
    });
  }
  return (
    <EmptyResult
      header={t('haku.ei-hakutuloksia')}
      text={t('haku.summary', { keyword: keyword })}
    />
  );
};

export default HakutulosResults;
