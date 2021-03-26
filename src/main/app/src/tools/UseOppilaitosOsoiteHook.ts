import { useEffect, useState } from 'react';

import { getOppilaitosOsa } from '#/src/api/konfoApi';
import { OsoiteParser } from '#/src/tools/Utils';

export interface OppilaitosOsoite {
  oppilaitosOid: string;
  yhteystiedot: string;
}

async function fetchOsoitteet(oppilaitosOids: Array<string>) {
  const oppilaitosDatas = await Promise.all(
    oppilaitosOids.filter(Boolean).map((oid) => getOppilaitosOsa(oid))
  );

  return oppilaitosDatas.map((data) => {
    // NOTE: Prioritize using oppilaitoksenOsa, otherwise the address of main oppilaitos is found inside oppilaitos-property
    const osoiteData =
      (data?.oppilaitoksenOsa || data?.oppilaitos?.oppilaitos)?.metadata.yhteystiedot
        ?.osoite ?? null;
    return {
      oppilaitosOid: data.oid,
      yhteystiedot: osoiteData && OsoiteParser.parseOsoiteData(osoiteData).yhteystiedot,
    };
  });
}

export const useOppilaitosOsoite = (oppilaitosOids: Array<string>) => {
  const [osoitteet, setOsoitteet] = useState<Array<OppilaitosOsoite>>([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (!dataFetched) {
      (async () => {
        try {
          const data = await fetchOsoitteet(oppilaitosOids);
          setDataFetched(true);
          setOsoitteet(data);
        } catch (e) {
          setDataFetched(true);
          console.error(e);
        }
      })();
    }
  }, [oppilaitosOids, dataFetched, osoitteet]);

  return osoitteet;
};
