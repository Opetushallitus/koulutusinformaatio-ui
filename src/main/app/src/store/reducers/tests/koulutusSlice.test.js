import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '#/src/api/konfoApi';

import reducer, {
  initialState,
  fetchKoulutusStart,
  fetchJarjestajatStart,
  fetchKoulutusSuccess,
  fetchJarjestajatSuccess,
  fetchKoulutusJarjestajat,
  fetchKoulutus,
} from '../koulutusSlice';
import { koulutusData, jarjestajatData } from './koulutusSliceTestData';
import tutkinnonOsaEperusteData from './tutkinnon-osa-eperuste-data.json';
import tutkinnonOsaKoulutusData from './tutkinnon-osa-koulutus-data.json';

const mockStore = configureMockStore([thunk]);

describe('koulutus slice', () => {
  describe('reducer, action creators and selectors', () => {
    it('should return initial state on first run', () => {
      const nextState = initialState;
      const result = reducer(undefined, {});
      expect(result).toEqual(nextState);
    });

    it('should set loading states properly', () => {
      let nextState = reducer(initialState, fetchKoulutusStart());
      expect(nextState.koulutusStatus).toEqual('loading');

      nextState = reducer(initialState, fetchJarjestajatStart());
      expect(nextState.jarjestajatStatus).toEqual('loading');

      nextState = reducer(
        initialState,
        fetchKoulutusSuccess({ oid: '12345', koulutus: {} })
      );
      expect(nextState.koulutusStatus).toEqual('idle');

      nextState = reducer(
        initialState,
        fetchJarjestajatSuccess({ oid: '12345', jarjestajat: {} })
      );
      expect(nextState.jarjestajatStatus).toEqual('idle');
    });
  });
});

describe('thunks', () => {
  const koulutusOid = '1.2.246.562.13.00000000000000000036';

  it('creates fetchKoulutusStart and fetchKoulutusSuccess when fetchKoulutus succeeds', async () => {
    const store = mockStore(initialState);
    api.getKoulutus = jest.fn().mockResolvedValueOnce(koulutusData);
    api.getKoulutusKuvaus = jest.fn().mockResolvedValueOnce({});

    await store.dispatch(fetchKoulutus(koulutusOid));
    const expectedActions = [
      fetchKoulutusStart(),
      fetchKoulutusSuccess({ oid: koulutusOid, koulutus: koulutusData }),
    ];

    expect(store.getActions()).toEqual(expectedActions);
    expect(api.getKoulutus).toBeCalledTimes(1);
    expect(api.getKoulutusKuvaus).toBeCalledTimes(1);
  });

  const tutkinnonOsaKoulutusOid = '1.2.246.562.13.00000000000000000598';

  it('creates fetchKoulutusStart and fetchKoulutusSuccess when fetchKoulutus succeeds', async () => {
    const store = mockStore(initialState);
    api.getKoulutus = jest.fn().mockResolvedValueOnce(tutkinnonOsaKoulutusData);
    api.getEperusteKuvaus = jest.fn().mockResolvedValueOnce(tutkinnonOsaEperusteData);

    await store.dispatch(fetchKoulutus(tutkinnonOsaKoulutusOid));
    const expectedActions = [
      fetchKoulutusStart(),
      fetchKoulutusSuccess({
        oid: tutkinnonOsaKoulutusOid,
        koulutus: tutkinnonOsaKoulutusData,
      }),
    ];

    expect(store.getActions()).toEqual(expectedActions);
    expect(api.getKoulutus).toBeCalledTimes(1);
    expect(api.getEperusteKuvaus).toBeCalledTimes(1);
  });

  it('creates fetchJarjestajatStart and fetchJarjestajatSuccess when fetchKoulutusJarjestajat succeeds', async () => {
    const store = mockStore(initialState);
    api.getKoulutusJarjestajat = jest.fn().mockResolvedValueOnce(jarjestajatData);

    await store.dispatch(fetchKoulutusJarjestajat(koulutusOid));
    const expectedActions = [
      fetchJarjestajatStart(),
      fetchJarjestajatSuccess({
        jarjestajatData,
      }),
    ];

    expect(store.getActions()).toEqual(expectedActions);
    expect(api.getKoulutusJarjestajat).toBeCalledTimes(1);
  });
});
