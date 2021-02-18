import { Alkamiskausityyppi } from '#/src/types/ToteutusTypes';
import { formatAloitus } from './utils';

describe('Utils/Localizer', () => {
  test.each([
    [
      {
        alkamiskausityyppi: Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA,
        henkilokohtaisenSuunnitelmanLisatiedot: 'lisatiedot',
      },
      {
        alkaaText: 'toteutus.koulutus-alkaa-henkilokohtainen',
        alkaaModalText: 'lisatiedot',
      },
    ],
  ])('localizeOsoite', (input, output) => {
    expect(formatAloitus(input as any, (t: any) => t)).toEqual(output);
  });
});
