import { localizeOsoite } from './localization';

describe('localization', () => {
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
    expect(localizeOsoite(osoite, postinumero)).toEqual(fullAddress);
  });
});
