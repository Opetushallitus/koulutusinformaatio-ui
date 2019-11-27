import VertailuStore from '../../stores/vertailu-store';

const koulutusSelected = {
  toggleKoulutus: true,
  createHakuUrl: '/haku',
};

const oppilaitosSelected = {
  toggleKoulutus: false,
};

const getToteutusPromise = {
  getToteutusPromise: (oid) => {
    const r = {
      body: { result: { koulutus: {} } },
    };
    r.body.result.koulutus[oid] = { oid: oid };
    return {
      then: (cb) => cb(r),
    };
  },
};

describe('VertailuStore.vertailuList', () => {
  it('koulutus array for toggleKoulutus true', () => {
    const vertailuStore = new VertailuStore(koulutusSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/koulutus/1' },
    ];
    vertailuStore.vertailuListOppilaitos = [
      { oid: '2', nimi: 'Oppilaitos4', link: '/oppilaitos/2' },
    ];

    expect(vertailuStore.vertailuList[0]).toEqual({
      oid: '1',
      nimi: 'Koulutus1',
      link: '/koulutus/1',
    });
  });

  it('oppilaitos array for toggleKoulutus false', () => {
    const vertailuStore = new VertailuStore(oppilaitosSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/koulutus/1' },
    ];
    vertailuStore.vertailuListOppilaitos = [
      { oid: '2', nimi: 'Oppilaitos4', link: '/oppilaitos/2' },
    ];

    expect(vertailuStore.vertailuList[0]).toEqual({
      oid: '2',
      nimi: 'Oppilaitos4',
      link: '/oppilaitos/2',
    });
  });
});

describe('VertailuStore.oids', () => {
  it('empty array for nothing selected', () => {
    let vertailuStore = new VertailuStore(koulutusSelected, null);
    expect(vertailuStore.oids).toEqual([]);
  });

  it('array of oids for objects selected', () => {
    let vertailuStore = new VertailuStore(koulutusSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/1' },
      { oid: '2', nimi: 'Koulutus2', link: '/2' },
      { oid: '3', nimi: 'Koulutus3', link: '/3' },
    ];
    expect(vertailuStore.oids).toEqual(['1', '2', '3']);
  });
});

describe('VertailuStore.isOidSelected', () => {
  it('true for selected oid', () => {
    let vertailuStore = new VertailuStore(koulutusSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/1' },
      { oid: '2', nimi: 'Koulutus2', link: '/2' },
      { oid: '3', nimi: 'Koulutus3', link: '/3' },
    ];
    expect(vertailuStore.isOidSelected('1')).toEqual(true);
  });

  it('false for not selected oid', () => {
    let vertailuStore = new VertailuStore(oppilaitosSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/1' },
      { oid: '2', nimi: 'Koulutus2', link: '/2' },
      { oid: '3', nimi: 'Koulutus3', link: '/3' },
    ];
    expect(vertailuStore.isOidSelected('2')).toEqual(false);
  });
});

describe('VertailuStore.size', () => {
  it('size of koulutus array for toggleKoulutus true', () => {
    let vertailuStore = new VertailuStore(koulutusSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/1' },
      { oid: '2', nimi: 'Koulutus2', link: '/2' },
      { oid: '3', nimi: 'Koulutus3', link: '/3' },
    ];
    expect(vertailuStore.size).toEqual(3);
  });
  it('size of oppilaitos array for toggleKoulutus false', () => {
    let vertailuStore = new VertailuStore(oppilaitosSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/1' },
      { oid: '2', nimi: 'Koulutus2', link: '/2' },
      { oid: '3', nimi: 'Koulutus3', link: '/3' },
    ];
    vertailuStore.vertailuListOppilaitos = [
      { oid: 4, nimi: 'Oppilaitos4', link: '/oppilaitos/4' },
    ];
    expect(vertailuStore.size).toEqual(1);
  });
});

describe('VertailuStore.selectItem', () => {
  it('should select item with given oid', () => {
    const vertailuStore = new VertailuStore(
      koulutusSelected,
      getToteutusPromise
    );
    vertailuStore.loadVertailuItem = (oid, cb) => cb({ oid: oid });
    vertailuStore.selectItem('1');
    expect(vertailuStore.isOidSelected('1')).toEqual(true);
    expect(vertailuStore.isOidSelected('0')).toEqual(false);
  });
});

describe('VertailuStore.clearItems', () => {
  it('should clear selected items', () => {
    let vertailuStore = new VertailuStore(koulutusSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/1' },
      { oid: '2', nimi: 'Koulutus2', link: '/2' },
      { oid: '3', nimi: 'Koulutus3', link: '/3' },
    ];
    vertailuStore.clearItems();
    expect(vertailuStore.vertailuListKoulutus).toEqual([]);
  });
});

describe('VertailuStore.removeItem', () => {
  it('should remove item with given oid', () => {
    let vertailuStore = new VertailuStore(koulutusSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/1' },
      { oid: '2', nimi: 'Koulutus2', link: '/2' },
      { oid: '3', nimi: 'Koulutus3', link: '/3' },
    ];
    vertailuStore.removeItem('1');
    expect(vertailuStore.isOidSelected('1')).toEqual(false);
    expect(vertailuStore.isOidSelected('2')).toEqual(true);
    expect(vertailuStore.isOidSelected('3')).toEqual(true);
    vertailuStore.removeItem('2');
    expect(vertailuStore.isOidSelected('2')).toEqual(false);
    expect(vertailuStore.isOidSelected('3')).toEqual(true);
    vertailuStore.removeItem('3');
    expect(vertailuStore.vertailuListKoulutus).toEqual([]);
  });
});

describe('VertailuStore.createVertailuLink', () => {
  it('should link with correct parameters', () => {
    let vertailuStore = new VertailuStore(koulutusSelected, null);
    vertailuStore.vertailuListKoulutus = [
      { oid: '1', nimi: 'Koulutus1', link: '/1' },
      { oid: '2', nimi: 'Koulutus2', link: '/2' },
      { oid: '3', nimi: 'Koulutus3', link: '/3' },
    ];
    expect(vertailuStore.createVertailuLink).toEqual(
      '/vertailu?oids=1,2,3&haku=%2Fhaku&lng=fi'
    );
  });
});
