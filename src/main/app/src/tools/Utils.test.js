import { Localizer } from './Utils.js';

describe('Utils/Localizer', () => {
  test.each([
    [
      { fi: 'Opintopolku 1' },
      { koodiUri: 'posti_00000#1', nimi: { fi: 'Helsinki' } },
      'Opintopolku 1, 00000 Helsinki',
    ],
    [undefined, undefined, ''],
    [{ fi: 'Opintopolku 1' }, undefined, ''],
    [undefined, { koodiUri: 'posti_00000#1', nimi: { fi: 'Helsinki' } }, ''],
  ])('localizeOsoite', (osoite, postinumero, fullAddress) => {
    expect(Localizer.localizeOsoite(osoite, postinumero)).toEqual(fullAddress);
  });
});
