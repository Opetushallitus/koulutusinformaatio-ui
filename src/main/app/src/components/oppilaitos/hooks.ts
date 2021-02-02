import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _fp from 'lodash/fp';
import { useQuery } from 'react-query';
import { Localizer as l } from '#/src/tools/Utils';
import {
  getOppilaitos,
  getOppilaitosOsa,
  getOppilaitosOsaTarjonta,
  getOppilaitosTarjonta,
} from '#/src/api/konfoApi';
import {
  getTarjontaPaginationProps,
  getTulevaTarjontaPaginationProps,
} from '#/src/store/reducers/oppilaitosSliceSelector';
import {
  setTarjontaPagination,
  setTulevaTarjontaPagination,
  resetPagination,
} from '#/src/store/reducers/oppilaitosSlice';

// Helpers
const getLocalizedmaksullisuus = (isMaksullinen: boolean, maksuAmount: number) =>
  isMaksullinen ? `${maksuAmount} €` : l.getTranslationForKey('toteutus.maksuton');

const removeOppilaitosName = (osaName: string, oppilaitosName: string) =>
  osaName.replace(`${oppilaitosName}, `, '');

const ACTIVE = 'AKTIIVINEN';

type UseOppilaitosProps = {
  oid: string;
  isOppilaitosOsa: boolean;
  isDraft?: boolean;
};

export const useOppilaitos = ({ oid, isOppilaitosOsa, isDraft }: UseOppilaitosProps) => {
  const { data: oppilaitos = {}, ...rest } = useQuery(
    ['getOppilaitos', { oid, isOppilaitosOsa, isDraft }],
    () =>
      isOppilaitosOsa ? getOppilaitosOsa(oid, isDraft) : getOppilaitos(oid, isDraft),
    { refetchOnWindowFocus: false, refetchOnReconnect: false, staleTime: 5000 }
  );

  return {
    data: {
      oppilaitos,
      oppilaitosOsat: _fp.flow(
        _fp.prop('osat'),
        _fp.filter({ status: ACTIVE }),
        _fp.map((osa: any) => ({
          ...osa,
          nimi: removeOppilaitosName(l.localize(osa.nimi), l.localize(oppilaitos.nimi)),
        }))
      )(oppilaitos),
      esittelyHtml: l.localize(_fp.get(oppilaitos, 'oppilaitos.metadata.esittely') ?? ''),
      tietoaOpiskelusta:
        _fp.get(oppilaitos, 'oppilaitos.metadata.tietoaOpiskelusta') ?? [],
    },
    ...rest,
  };
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
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 60 * 1000,
      select: (tarjontaData) =>
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
