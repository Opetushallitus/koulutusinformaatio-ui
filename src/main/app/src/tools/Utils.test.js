import { Localizer, OsoiteParser } from './Utils.js';

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

describe('Utils/OsoiteParser', () => {
  test.each([
    ['PL 123', 'Pömpele', 'Pömpele'],
    ['PL 123, Tie 123', 'Pömpele', 'Pömpele Tie 123'],
    ['Tie 123, Loppuosa', 'Pömpele', 'Pömpele Tie 123'],
    ['PL 123, Tie 123, Loppuosa', 'Pömpele', 'Pömpele Tie 123'],
  ])('getSearchAddress.address', (osoite, postinumeroJaPaikka, expected) => {
    expect(OsoiteParser.getSearchAddress(postinumeroJaPaikka, osoite).address).toEqual(
      expected
    );
  });

  test.each([
    ['Tie 123', 'Pömpele', 'Pömpele Tie'],
    ['Tie', 'Pömpele', 'Pömpele Tie'],
  ])('getSearchAddress.addressNoNumbers', (osoite, postinumeroJaPaikka, expected) => {
    expect(
      OsoiteParser.getSearchAddress(postinumeroJaPaikka, osoite).addressNoNumbers
    ).toEqual(expected);
  });
});
