import { useEffect, useState } from 'react';

import { getOppilaitos, getOppilaitosOsa } from '#/src/api/konfoApi';
import { parseOsoiteData } from '#/src/tools/utils';

export interface OppilaitosOsoite {
  oppilaitosOid: string;
  yhteystiedot: string;
  hakijapalveluidenYhteystiedot?: string;
}

const fetchOppilaitosOsoitteet = async (oppilaitosOids: Array<string>) => {
  const oppilaitosDatas = await Promise.all(
    oppilaitosOids.filter(Boolean).map((oid) => getOppilaitos(oid))
  );

  return oppilaitosDatas.map((data) => {
    const hakijapalvelutData =
      data.oppilaitos?.metadata.hakijapalveluidenYhteystiedot ?? null;

    return {
      oppilaitosOid: data.oid,
      yhteystiedot: data.oppilaitos?.metadata.yhteystiedot?.map(parseOsoiteData) ?? [],
      hakijapalveluidenYhteystiedot:
        hakijapalvelutData && parseOsoiteData(hakijapalvelutData),
    };
  });
};

const fetchOppilaitosOsaOsoitteet = async (oppilaitosOsaOids: Array<string>) => {
  const oppilaitosDatas = await Promise.all(
    oppilaitosOsaOids.filter(Boolean).map((oid) => getOppilaitosOsa(oid))
  );

  return oppilaitosDatas.map((data) => {
    // NOTE: Prioritize using oppilaitoksenOsa, otherwise the address of main oppilaitos is found inside oppilaitos-property
    const osoiteData =
      (data?.oppilaitoksenOsa || data?.oppilaitos?.oppilaitos)?.metadata.yhteystiedot ??
      null;
    return {
      oppilaitosOid: data.oid,
      yhteystiedot: osoiteData && parseOsoiteData(osoiteData?.postiosoite).yhteystiedot,
    };
  });
};

export const useOsoitteet = (
  oppilaitosOids: Array<string>,
  isOppilaitosOsa?: boolean
) => {
  const fetchFn = isOppilaitosOsa
    ? fetchOppilaitosOsaOsoitteet
    : fetchOppilaitosOsoitteet;
  const [osoitteet, setOsoitteet] = useState<Array<OppilaitosOsoite>>([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (!dataFetched) {
      (async () => {
        try {
          const data = await fetchFn(oppilaitosOids);
          setDataFetched(true);
          setOsoitteet(data);
        } catch (e) {
          setDataFetched(true);
          console.error(e);
        }
      })();
    }
  }, [fetchFn, oppilaitosOids, dataFetched, osoitteet]);

  return osoitteet;
};
