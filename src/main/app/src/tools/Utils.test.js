import { OsoiteParser } from './Utils';

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
