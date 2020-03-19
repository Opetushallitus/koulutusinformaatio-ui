import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as api from '../api/konfoApi';
import reducer, {
  initialState,
  fetchKoulutusStart,
  fetchJarjestajatStart,
  fetchKoulutusSuccess,
  fetchJarjestajatSuccess,
  fetchKoulutusJarjestajat,
  fetchKoulutus,
} from './koulutusSlice';
import { koulutusData, jarjestajatData } from './koulutusSliceTestData';

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
      expect(nextState.loading).toEqual(1);

      nextState = reducer(initialState, fetchJarjestajatStart());
      expect(nextState.loading).toEqual(1);

      nextState = reducer(
        initialState,
        fetchKoulutusSuccess({ oid: '12345', koulutus: {} })
      );
      expect(nextState.loading).toEqual(-1);

      nextState = reducer(
        initialState,
        fetchJarjestajatSuccess({ oid: '12345', jarjestajat: {} })
      );
      expect(nextState.loading).toEqual(-1);
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
  });
  it('creates fetchJarjestajatStart and fetchJarjestajatSuccess when fetchKoulutusJarjestajat succeeds', async () => {
    const store = mockStore(initialState);
    api.getKoulutusJarjestajat = jest
      .fn()
      .mockResolvedValueOnce(jarjestajatData);
    await store.dispatch(fetchKoulutusJarjestajat(koulutusOid));
    const expectedActions = [
      fetchJarjestajatStart(),
      fetchJarjestajatSuccess({
        oid: koulutusOid,
        jarjestajat: jarjestajatData,
      }),
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
});
