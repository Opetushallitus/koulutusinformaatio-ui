import { useEffect, useMemo } from 'react';

import _fp from 'lodash/fp';
import { useQueries, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import {
  getOppilaitos,
  getOppilaitosOsa,
  getOppilaitosOsaTarjonta,
  getOppilaitosTarjonta,
} from '#/src/api/konfoApi';
import {
  setTarjontaPagination,
  setTulevaTarjontaPagination,
  resetPagination,
} from '#/src/store/reducers/oppilaitosSlice';
import {
  getTarjontaPaginationProps,
  getTulevaTarjontaPaginationProps,
} from '#/src/store/reducers/oppilaitosSliceSelector';
import { Localizer as l } from '#/src/tools/Utils';

// Helpers
const getLocalizedmaksullisuus = (isMaksullinen: boolean, maksuAmount: number) =>
  isMaksullinen ? `${maksuAmount} €` : l.getTranslationForKey('toteutus.maksuton');

const removeOppilaitosName = (osaName: string, oppilaitosName: string) =>
  osaName.replace(`${oppilaitosName}, `, '');

const ACTIVE = 'AKTIIVINEN';

const handleOppilaitosData = (
  isOppilaitosOsa: boolean,
  data: any,
  rest: Omit<ReturnType<typeof useQuery>, 'data'>
) => {
  const entity = isOppilaitosOsa ? data.oppilaitoksenOsa : data.oppilaitos ?? {};
  return {
    data: {
      ...data,
      ...entity,
      oppilaitosOsat: !isOppilaitosOsa
        ? _fp.flow(
            _fp.prop('osat'),
            _fp.filter({ status: ACTIVE }),
            _fp.map((osa: any) => ({
              ...osa,
              nimi: removeOppilaitosName(l.localize(osa.nimi), l.localize(data.nimi)),
            }))
          )(data)
        : undefined,
      esittelyHtml: l.localize(entity?.metadata?.esittely) ?? '',
      tietoaOpiskelusta: entity?.metadata?.tietoaOpiskelusta ?? [],
      kotipaikat: data?.osat?.map(_fp.prop('kotipaikka')) ?? [data?.kotipaikka],
    },
    ...rest,
  };
};

type UseOppilaitosProps = {
  oid: string;
  isOppilaitosOsa: boolean;
  isDraft?: boolean;
};

export const useOppilaitos = ({ oid, isOppilaitosOsa, isDraft }: UseOppilaitosProps) => {
  const { data = {}, ...rest } = useQuery(
    ['getOppilaitos', { oid, isOppilaitosOsa, isDraft }],
    () => (isOppilaitosOsa ? getOppilaitosOsa(oid, isDraft) : getOppilaitos(oid, isDraft))
  );
  return useMemo(() => handleOppilaitosData(isOppilaitosOsa, data, rest), [
    isOppilaitosOsa,
    data,
    rest,
  ]);
};

type UseOppilaitoksetProps = {
  oids: Array<string>;
  isOppilaitosOsa: boolean;
  isDraft?: boolean;
};

export const useOppilaitokset = ({
  oids,
  isOppilaitosOsa,
  isDraft,
}: UseOppilaitoksetProps) => {
  const results = useQueries(
    oids.map((oid) => ({
      queryKey: ['getOppilaitos', { oid, isOppilaitosOsa, isDraft }],
      queryFn: isOppilaitosOsa
        ? () => getOppilaitosOsa(oid, isDraft)
        : () => getOppilaitos(oid, isDraft),
    }))
  );

  return useMemo(
    () =>
      results.map(({ data = {}, ...rest }) =>
        handleOppilaitosData(isOppilaitosOsa, data, rest)
      ),
    [isOppilaitosOsa, results]
  );
};

type UsePaginatedTarjontaProps = {
  oid: string;
  isOppilaitosOsa: boolean;
  isTuleva?: boolean;
};

const selectTarjonta = (tarjonta: any) => {
  return {
    values: _fp.map(
      (t: any) => ({
        toteutusName: l.localize(t.nimi),
        description: l.localize(t.kuvaus),
        locations: l.localizeSortedArrayToString(t.kunnat),
        opetustapa: l.localizeSortedArrayToString(t.opetusajat),
        price: getLocalizedmaksullisuus(t.onkoMaksullinen, t.maksunMaara),
        tyyppi: t.koulutustyyppi,
        kuva: t.kuva,
        toteutusOid: t.toteutusOid,
      }),
      tarjonta?.hits
    ),
    hasHits: _fp.size(tarjonta?.hits) > 0,
    total: tarjonta?.total,
  };
};

const selectTulevaTarjonta = (tulevaTarjonta: any) => {
  const hits = tulevaTarjonta?.hits ?? [];
  const total = tulevaTarjonta?.total ?? 0;
  const localizedTulevaTarjonta = hits.map((k: any) => ({
    koulutusOid: k.koulutusOid,
    koulutusName: l.localize(k.nimi),
    tutkintonimikkeet: l.localizeSortedArrayToString(k.tutkintonimikkeet),
    koulutustyypit: l.localizeSortedArrayToString(k.koulutustyypit),
    opintojenlaajuus: `${l.localize(k.opintojenLaajuus)} ${l.localize(
      k.opintojenLaajuusyksikko
    )}`,
    tyyppi: k.koulutustyyppi,
  }));

  return { values: localizedTulevaTarjonta, total };
};

export const usePaginatedTarjonta = ({
  oid,
  isOppilaitosOsa,
  isTuleva,
}: UsePaginatedTarjontaProps) => {
  const dispatch = useDispatch();

  // Reset pagination when oid changes (which means that another oppilaitos-page was opened)
  useEffect(() => {
    dispatch(resetPagination());
  }, [dispatch, oid]);

  const paginationProps = useSelector((state) =>
    isTuleva ? getTulevaTarjontaPaginationProps(state) : getTarjontaPaginationProps(state)
  );

  const fetchProps = {
    oid,
    requestParams: {
      tuleva: isTuleva,
      ...paginationProps,
    },
  };

  const result = useQuery(
    ['getPaginatedTarjonta', fetchProps],
    () =>
      isOppilaitosOsa
        ? getOppilaitosOsaTarjonta(fetchProps)
        : getOppilaitosTarjonta(fetchProps),
    {
      enabled: Boolean(oid),
      keepPreviousData: true,
      staleTime: 60 * 1000,
      select: (tarjontaData: any) =>
        isTuleva ? selectTulevaTarjonta(tarjontaData) : selectTarjonta(tarjontaData),
    }
  );

  return useMemo(
    () => ({
      queryResult: result,
      pagination: paginationProps,
      setPagination: (newPagination: any) => {
        dispatch(
          isTuleva
            ? setTulevaTarjontaPagination({ ...paginationProps, ...newPagination })
            : setTarjontaPagination({ ...paginationProps, ...newPagination })
        );
      },
    }),
    [result, paginationProps, isTuleva, dispatch]
  );
};
