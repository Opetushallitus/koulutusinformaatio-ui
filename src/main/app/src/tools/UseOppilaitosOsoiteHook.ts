import { getOppilaitosOsa } from '#/src/api/konfoApi';
import { OsoiteParser } from '#/src/tools/Utils';
import { useEffect, useState } from 'react';

export interface OppilaitosOsoite {
  oppilaitosOid: string;
  yhteystiedot: string;
}

async function fetchOsoitteet(oppilaitosOids: String[]) {
  const oppilaitosDatas = await Promise.all(
    oppilaitosOids.filter(Boolean).map((oid) => getOppilaitosOsa(oid))
  );

  return oppilaitosDatas.map((data) => {
    // NOTE: Prioritize using oppilaitoksenOsa, otherwise the address of main oppilaitos is found inside oppilaitos-property
    const osoiteData = (data?.oppilaitoksenOsa || data?.oppilaitos?.oppilaitos).metadata
      .yhteystiedot.osoite;
    return {
      oppilaitosOid: data.oid,
      yhteystiedot: OsoiteParser.parseOsoiteData(osoiteData).yhteystiedot,
    };
  });
}

export const useOppilaitosOsoite = (oppilaitosOids: String[]) => {
  const [osoitteet, setOsoitteet] = useState<OppilaitosOsoite[]>();
  const [dataNotFetched, setDataNotFetched] = useState(true);

  useEffect(() => {
    if (dataNotFetched) {
      (async () => {
        try {
          const data = await fetchOsoitteet(oppilaitosOids);
          setDataNotFetched(false);
          setOsoitteet(data);
        } catch (e) {
          setDataNotFetched(false);
          console.error(e);
        }
      })();
    }
  }, [oppilaitosOids, dataNotFetched, osoitteet]);

  return osoitteet;
};
