import _fp from 'lodash/fp';
import { useQuery } from 'react-query';
import { Localizer as l } from '#/src/tools/Utils';
import { getOppilaitos, getOppilaitosOsa } from '#/src/api/konfoApi';

const removeOppilaitosName = (osaName, oppilaitosName) =>
  osaName.replace(`${oppilaitosName}, `, '');

const ACTIVE = 'AKTIIVINEN';

export const useOppilaitos = ({ oid, isOppilaitosOsa }) => {
  const { data: oppilaitos = {}, ...rest } = useQuery(
    ['getOppilaitos', { oid, isOppilaitosOsa }],
    () => (isOppilaitosOsa ? getOppilaitosOsa(oid) : getOppilaitos(oid))
  );

  return {
    data: {
      oppilaitos,
      oppilaitosOsat: _fp.flow(
        _fp.prop('osat'),
        _fp.filter({ status: ACTIVE }),
        _fp.map((osa) => ({
          ...osa,
          nimi: removeOppilaitosName(l.localize(osa.nimi), l.localize(oppilaitos.nimi)),
        }))
      )(oppilaitos),
      esittelyHtml: l.localize(_fp.get(oppilaitos, 'oppilaitos.metadata.esittely', '')),
      tietoaOpiskelusta: _fp.get(oppilaitos, 'oppilaitos.metadata.tietoaOpiskelusta', []),
    },
    ...rest,
  };
};
