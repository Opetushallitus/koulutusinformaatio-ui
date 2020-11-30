import { getOppilaitosOsa } from '#/src/api/konfoApi';
import { OsoiteParser } from '#/src/tools/Utils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

async function fetchOsoitteet(
  oppilaitosOids: String[],
  setOsoitteet: Dispatch<SetStateAction<any[]>>
) {
  if (oppilaitosOids.length > 0) {
    const oppilaitosDatas = await Promise.all(
      oppilaitosOids.map((oid) => getOppilaitosOsa(oid))
    );
    const osoitteet = oppilaitosDatas.map((data) => {
      // NOTE: Prioritize using oppilaitoksenOsa, otherwise the address of main oppilaitos is found inside oppilaitos-property
      const osoiteData = (data?.oppilaitoksenOsa || data?.oppilaitos?.oppilaitos).metadata
        .yhteystiedot.osoite;
      return OsoiteParser.parseOsoiteData(osoiteData).yhteystiedot;
    });
    setOsoitteet(osoitteet);
  }
}

export const useOppilaitosOsoite = (oppilaitosOids: String[]) => {
  const [osoitteet, setOsoitteet] = useState([] as any[]);
  const [dataNotFetched, setDataNotFetched] = useState(true);

  useEffect(() => {
    if (dataNotFetched) {
      (async () => {
        try {
          await fetchOsoitteet(oppilaitosOids, setOsoitteet);
        } catch (e) {
          console.error(e);
        } finally {
          setDataNotFetched(false);
        }
      })();
    }
  }, [oppilaitosOids, dataNotFetched, osoitteet]);

  return osoitteet;
};
