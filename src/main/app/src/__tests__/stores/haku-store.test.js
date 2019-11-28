import HakuStore from '../../stores/haku-store';

const rest = {
  searchKoulutuksetPromise: () => {
    return {
      result: [{ oid: 1 }, { oid: 2 }],
      count: 2,
    };
  },
  searchOppilaitoksetPromise: () => {
    return {
      result: [{ oid: 3 }, { oid: 4 }, { oid: 5 }],
      count: 3,
    };
  },
  search: (promises, resultAction) => {
    resultAction(promises);
  },
};

describe('HakuStore.setKeyword', () => {
  it('set keyword', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setKeyword('keyword');
    expect(hakuStore.keyword).toEqual('keyword');
  });

  it('true when keyword changed', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    expect(hakuStore.setKeyword('keyword')).toEqual(true);
  });

  it('false when same keyword', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setKeyword('keyword');
    expect(hakuStore.setKeyword('keyword')).toEqual(false);
  });
});

describe('HakuStore.keywordSet', () => {
  it('false when no keyword', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    expect(hakuStore.keywordSet).toEqual(false);
  });

  it('true when keyword set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setKeyword('keyword');
    expect(hakuStore.keywordSet).toEqual(true);
  });
});

describe('HakuStore.setFilter', () => {
  const filter = {
    koulutus: 'kk,ako',
    kieli: 'fi,sv',
    paikkakunta: 'espoo',
  };

  it('set filter', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setFilter(filter);
    expect(hakuStore.filter).toEqual({
      koulutus: ['kk', 'ako'],
      kieli: ['fi', 'sv'],
      paikkakunta: 'espoo',
    });
  });

  it('true when koulutus change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setFilter(filter);
    const filter2 = {
      koulutus: 'kk,ako,amm',
      kieli: 'fi,sv',
      paikkakunta: 'espoo',
    };
    expect(hakuStore.setFilter(filter2)).toEqual(true);
  });

  it('true when kieli change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setFilter(filter);
    const filter2 = {
      koulutus: 'kk,ako',
      kieli: 'fi,sv,en',
      paikkakunta: 'espoo',
    };
    expect(hakuStore.setFilter(filter2)).toEqual(true);
  });

  it('true when paikkakunta change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setFilter(filter);
    const filter2 = {
      koulutus: 'kk,ako',
      kieli: 'fi,sv',
      paikkakunta: 'helsinki',
    };
    expect(hakuStore.setFilter(filter2)).toEqual(true);
  });

  it('false when no change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setFilter(filter);

    expect(hakuStore.setFilter(filter)).toEqual(false);
  });
});

describe('HakuStore.filterSet', () => {
  it('true when koulutus filter set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const filter = {
      koulutus: 'kk,ako',
      kieli: '',
      paikkakunta: '',
    };
    hakuStore.setFilter(filter);
    expect(hakuStore.filterSet).toEqual(true);
  });

  it('true when kieli filter set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const filter = {
      koulutus: '',
      kieli: 'fi,sv',
      paikkakunta: '',
    };
    hakuStore.setFilter(filter);
    expect(hakuStore.filterSet).toEqual(true);
  });

  it('true when paikkakunta filter set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const filter = {
      koulutus: '',
      kieli: '',
      paikkakunta: 'espoo',
    };
    hakuStore.setFilter(filter);
    expect(hakuStore.filterSet).toEqual(true);
  });

  it('false when no filter set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const filter = {
      koulutus: '',
      kieli: '',
      paikkakunta: '',
    };
    hakuStore.setFilter(filter);
    expect(hakuStore.filterSet).toEqual(false);
  });
});

describe('HakuStore.setPaging', () => {
  it('set paging', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 3,
      pageKoulutus: 2,
      pageSize: 25,
    };
    hakuStore.setPaging(paging);
    expect(hakuStore.paging).toEqual({
      pageOppilaitos: 3,
      pageKoulutus: 2,
      pageSize: 25,
    });
  });

  it('{true, true} when pagesize change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 1,
      pageKoulutus: 1,
      pageSize: 25,
    };
    expect(hakuStore.setPaging(paging)).toEqual({
      koulutus: true,
      oppilaitos: true,
    });
  });

  it('{true, false} when koulutus page change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 1,
      pageKoulutus: 2,
      pageSize: 20,
    };
    expect(hakuStore.setPaging(paging)).toEqual({
      koulutus: true,
      oppilaitos: false,
    });
  });

  it('{false, true} when oppilaitos page change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 3,
      pageKoulutus: 1,
      pageSize: 20,
    };
    expect(hakuStore.setPaging(paging)).toEqual({
      koulutus: false,
      oppilaitos: true,
    });
  });

  it('{false, false} when no change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 1,
      pageKoulutus: 1,
      pageSize: 20,
    };
    expect(hakuStore.setPaging(paging)).toEqual({
      koulutus: false,
      oppilaitos: false,
    });
  });
});

describe('HakuStore.setToggle', () => {
  it('set toggle', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setToggle('oppilaitos');
    expect(hakuStore.toggle).toEqual('oppilaitos');
  });

  it('default to oppilaitos for malformed parameters', () => {
    expect.assertions(3);
    const hakuStore = new HakuStore(null);
    hakuStore.setToggle('aoiwfh');
    expect(hakuStore.toggle).toEqual('oppilaitos');
    hakuStore.setToggle(undefined);
    expect(hakuStore.toggle).toEqual('oppilaitos');
    hakuStore.setToggle(null);
    expect(hakuStore.toggle).toEqual('oppilaitos');
  });

  it('true when toggle change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    expect(hakuStore.setToggle('oppilaitos')).toEqual(true);
  });

  it('false when no change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    expect(hakuStore.setToggle('koulutus')).toEqual(false);
  });
});

describe('HakuStore.toggleKoulutus', () => {
  it('true when "koulutus"', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.toggle = 'koulutus';
    expect(hakuStore.toggleKoulutus).toEqual(true);
  });

  it('false when "oppilaitos"', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.toggle = 'oppilaitos';
    expect(hakuStore.toggleKoulutus).toEqual(false);
  });
});

describe('HakuStore.hasKoulutusResult', () => {
  it('false when no result', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    expect(hakuStore.hasKoulutusResult).toEqual(false);
  });

  it('true when result', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.koulutusResult = [{ oid: 1 }];
    expect(hakuStore.hasKoulutusResult).toEqual(true);
  });
});

describe('HakuStore.hasOppilaitosResult', () => {
  it('false when no result', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    expect(hakuStore.hasOppilaitosResult).toEqual(false);
  });

  it('true when result', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.oppilaitosResult = [{ oid: 1 }];
    expect(hakuStore.hasOppilaitosResult).toEqual(true);
  });
});

describe('HakuStore.totalCount', () => {
  it('sum of oppilaitosCount and koulutusCount', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);

    hakuStore.oppilaitosCount = 10;
    hakuStore.koulutusCount = 10;

    expect(hakuStore.totalCount).toEqual(20);
  });
});

describe('HakuStore.createHakuUrl', () => {
  it('create haku url when no keyword and filter set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 3,
      pageKoulutus: 2,
      pageSize: 25,
    };
    hakuStore.setPaging(paging);
    expect(hakuStore.createHakuUrl).toEqual(
      '/haku?toggle=koulutus&kpage=2&opage=3&pagesize=25&lng=fi'
    );
  });

  it('create haku url when only keyword set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 3,
      pageKoulutus: 2,
      pageSize: 25,
    };
    hakuStore.setPaging(paging);
    hakuStore.setKeyword('keyword');
    expect(hakuStore.createHakuUrl).toEqual(
      '/haku/keyword?toggle=koulutus&kpage=2&opage=3&pagesize=25&lng=fi'
    );
  });

  it('create haku url when only filter set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 3,
      pageKoulutus: 2,
      pageSize: 25,
    };
    hakuStore.setPaging(paging);
    const filter = {
      koulutus: 'kk,ako',
      kieli: 'fi,sv',
      paikkakunta: 'espoo',
    };
    hakuStore.setFilter(filter);
    expect(hakuStore.createHakuUrl).toEqual(
      '/haku?toggle=koulutus&kpage=2&opage=3&pagesize=25&paikkakunta=espoo&koulutustyyppi=kk,ako&kieli=fi,sv&lng=fi'
    );
  });
});

describe('HakuStore.searchParams', () => {
  it('create search params', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 3,
      pageKoulutus: 2,
      pageSize: 25,
    };
    hakuStore.setPaging(paging);
    const filter = {
      koulutus: 'kk,ako',
      kieli: 'fi,sv',
      paikkakunta: 'espoo',
    };
    hakuStore.setFilter(filter);
    expect(hakuStore.searchParams).toEqual(
      '?toggle=koulutus&kpage=2&opage=3&pagesize=25&paikkakunta=espoo&koulutustyyppi=kk,ako&kieli=fi,sv&lng=fi'
    );
  });
});

describe('HakuStore.maxPageKoulutus', () => {
  it('should return max number of pages', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.koulutusCount = 101;
    hakuStore.paging.pageSize = 25;
    expect(hakuStore.maxPageKoulutus).toEqual(5);
  });

  it('should always be at least 1', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.koulutusCount = 0;
    hakuStore.paging.pageSize = 25;
    expect(hakuStore.maxPageKoulutus).toEqual(1);
  });
});

describe('HakuStore.maxPageOppilaitos', () => {
  it('should return max number of pages', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.oppilaitosCount = 101;
    hakuStore.paging.pageSize = 25;
    expect(hakuStore.maxPageOppilaitos).toEqual(5);
  });

  it('should always be at least 1', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.oppilaitosCount = 0;
    hakuStore.paging.pageSize = 25;
    expect(hakuStore.maxPageOppilaitos).toEqual(1);
  });
});

describe('HakuStore.maxPageNumber', () => {
  it('maxPageKoulutus when toggle=koulutus', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.toggle = 'koulutus';
    hakuStore.koulutusCount = 60;
    hakuStore.oppilaitosCount = 0;
    expect(hakuStore.maxPageNumber).toEqual(3);
  });

  it('maxPageOppilaitos when toggle=oppilaitos', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.toggle = 'oppilaitos';
    hakuStore.koulutusCount = 0;
    hakuStore.oppilaitosCount = 35;
    expect(hakuStore.maxPageNumber).toEqual(2);
  });
});

describe('HakuStore.currentPageNumber', () => {
  it('current koulutus page when toggle=koulutus', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.toggle = 'koulutus';
    hakuStore.paging.pageKoulutus = 2;
    hakuStore.paging.pageOppilaitos = 5;
    expect(hakuStore.currentPageNumber).toEqual(2);
  });

  it('current koulutus page when toggle=oppilaitos', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.toggle = 'oppilaitos';
    hakuStore.paging.pageKoulutus = 2;
    hakuStore.paging.pageOppilaitos = 5;
    expect(hakuStore.currentPageNumber).toEqual(5);
  });
});

describe('HakuStore.maxPageSize', () => {
  it('koulutus count when toggle=koulutus', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.toggle = 'koulutus';
    hakuStore.koulutusCount = 2;
    expect(hakuStore.maxPageSize).toEqual(2);
  });

  it('oppilaitos count when toggle=oppilaitos', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.toggle = 'oppilaitos';
    hakuStore.oppilaitosCount = 5;
    expect(hakuStore.maxPageSize).toEqual(5);
  });
});

describe('HakuStore.clearHaku', () => {
  it('should clear haku-store', () => {
    expect.assertions(8);
    const hakuStore = new HakuStore(null);
    const paging = {
      pageOppilaitos: 3,
      pageKoulutus: 2,
      pageSize: 25,
    };
    hakuStore.setPaging(paging);
    const filter = {
      koulutus: 'kk,ako',
      kieli: 'fi,sv',
      paikkakunta: 'espoo',
    };
    hakuStore.setFilter(filter);
    hakuStore.setKeyword('keyword');
    hakuStore.toggle = 'oppilaitos';
    hakuStore.koulutusCount = 2;
    hakuStore.koulutusResult = [{ oid: 1 }, { oid: 2 }];
    hakuStore.oppilaitosCount = 2;
    hakuStore.oppilaitosResult = [{ oid: 1 }, { oid: 2 }];
    hakuStore.clearHaku();

    expect(hakuStore.paging).toEqual({
      pageOppilaitos: 1,
      pageKoulutus: 1,
      pageSize: 20,
    });
    expect(hakuStore.filter).toEqual({
      koulutus: [],
      kieli: [],
      paikkakunta: '',
    });
    expect(hakuStore.keyword).toEqual('');
    expect(hakuStore.toggle).toEqual('koulutus');
    expect(hakuStore.koulutusResult).toEqual([]);
    expect(hakuStore.koulutusCount).toEqual(0);
    expect(hakuStore.oppilaitosResult).toEqual([]);
    expect(hakuStore.oppilaitosCount).toEqual(0);
  });
});

describe('HakuStore.setAll', () => {
  it('should set filter, keyword, paging and toggle', () => {
    expect.assertions(5);
    const hakuStore = new HakuStore(rest);

    const mockSetToggle = jest.fn();
    hakuStore.setToggle = mockSetToggle;

    const search = {
      koulutustyyppi: 'kk,ako',
      kieli: 'fi,sv',
      paikkakunta: 'espoo',
      opage: 3,
      kpage: 2,
      pagesize: 25,
      toggle: 'koulutus',
    };
    hakuStore.setAll('keyword', search, () => {});
    expect(hakuStore.filter).toEqual({
      koulutus: ['kk', 'ako'],
      kieli: ['fi', 'sv'],
      paikkakunta: 'espoo',
    });
    expect(hakuStore.paging).toEqual({
      pageOppilaitos: 3,
      pageKoulutus: 2,
      pageSize: 25,
    });
    expect(hakuStore.keyword).toEqual('keyword');
    expect(mockSetToggle.mock.calls.length).toEqual(1);
    expect(mockSetToggle.mock.calls[0][0]).toEqual('koulutus');
  });

  it('should set toggle to highest count if no toggle in parameters and call toggleAction', () => {
    expect.assertions(3);
    const hakuStore = new HakuStore(rest);
    const mockSetToggle = jest.fn();
    hakuStore.setToggle = mockSetToggle;

    const search = {
      koulutustyyppi: 'kk,ako',
      kieli: 'fi,sv',
      paikkakunta: 'espoo',
      opage: 1,
      kpage: 2,
      pagesize: 25,
    };
    hakuStore.oppilaitosCount = 10;
    hakuStore.setAll('keyword', search, (toggle) => {
      expect(toggle).toEqual('oppilaitos');
    });
    expect(mockSetToggle.mock.calls.length).toEqual(1);
    expect(mockSetToggle.mock.calls[0][0]).toEqual('oppilaitos');
  });

  it('should call searchKoutukset if koulutus paging change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(rest);
    const mockSearchKoulutukset = jest.fn();

    hakuStore.searchKoulutukset = mockSearchKoulutukset;

    const search = {
      opage: 1,
      kpage: 2,
    };
    hakuStore.setAll('', search);
    expect(mockSearchKoulutukset.mock.calls.length).toEqual(1);
  });
  it('should call searchOppilaitokset if oppilaitos paging change', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(rest);
    const mockSearchOppilaitokset = jest.fn();

    hakuStore.searchOppilaitokset = mockSearchOppilaitokset;

    const search = {
      opage: 2,
      kpage: 1,
    };
    hakuStore.setAll('', search);
    expect(mockSearchOppilaitokset.mock.calls.length).toEqual(1);
  });

  it('should call setToggle if no other changes', () => {
    expect.assertions(2);
    const hakuStore = new HakuStore(rest);
    const mockSetToggle = jest.fn();
    hakuStore.setToggle = mockSetToggle;

    const search = {
      toggle: 'oppilaitos',
    };
    hakuStore.setAll('', search);
    expect(mockSetToggle.mock.calls.length).toEqual(1);
    expect(mockSetToggle.mock.calls[0][0]).toEqual('oppilaitos');
  });
});

describe('HakuStore.canSearch', () => {
  it('true when keyword set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    hakuStore.setKeyword('keyword');

    expect(hakuStore.canSearch).toEqual(true);
  });

  it('true when filter set', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    const filter = {
      koulutustyyppi: 'kk,ako',
      kieli: 'fi,sv',
      paikkakunta: 'espoo',
    };
    hakuStore.setFilter(filter);

    expect(hakuStore.canSearch).toEqual(true);
  });

  it('false when no keyword or filter', () => {
    expect.assertions(1);
    const hakuStore = new HakuStore(null);
    expect(hakuStore.canSearch).toEqual(false);
  });
});

describe('HakuStore.searchKoulutukset', () => {
  it('should search koulutukset', () => {
    expect.assertions(2);
    const hakuStore = new HakuStore(rest);
    hakuStore.setKeyword('keyword');
    hakuStore.searchKoulutukset(() => {
      expect(hakuStore.koulutusCount).toEqual(2);
      expect(hakuStore.koulutusResult).toEqual([{ oid: 1 }, { oid: 2 }]);
    });
  });
});

describe('HakuStore.searchOppilaitokset', () => {
  it('should search oppilaitokset', () => {
    expect.assertions(2);
    const hakuStore = new HakuStore(rest);
    hakuStore.setKeyword('keyword');
    hakuStore.searchOppilaitokset(() => {
      expect(hakuStore.oppilaitosCount).toEqual(3);
      expect(hakuStore.oppilaitosResult).toEqual([
        { oid: 3 },
        { oid: 4 },
        { oid: 5 },
      ]);
    });
  });
});

describe('HakuStore.searchAll', () => {
  it('should search both', () => {
    expect.assertions(4);
    const hakuStore = new HakuStore(rest);
    hakuStore.setKeyword('keyword');
    hakuStore.searchAll(() => {
      expect(hakuStore.koulutusCount).toEqual(2);
      expect(hakuStore.koulutusResult).toEqual([{ oid: 1 }, { oid: 2 }]);
      expect(hakuStore.oppilaitosCount).toEqual(3);
      expect(hakuStore.oppilaitosResult).toEqual([
        { oid: 3 },
        { oid: 4 },
        { oid: 5 },
      ]);
    });
  });
});

describe('HakuStore.loadNextPage', () => {
  it('should do nothing if last page', () => {
    expect.assertions(2);
    const hakuStore = new HakuStore(null);
    hakuStore.koulutusCount = 40;
    hakuStore.paging.pageKoulutus = 2;
    hakuStore.loadNextPage();
    expect(hakuStore.paging.pageKoulutus).toEqual(2);

    hakuStore.toggle = 'oppilaitos';
    hakuStore.oppilaitosCount = 60;
    hakuStore.paging.pageOppilaitos = 3;
    hakuStore.loadNextPage();
    expect(hakuStore.paging.pageOppilaitos).toEqual(3);
  });

  it('should change to next page if not last', () => {
    expect.assertions(4);
    const hakuStore = new HakuStore(null);

    const mockSearchKoulutukset = jest.fn();
    const mockSearchOppilaitokset = jest.fn();

    hakuStore.searchKoulutukset = mockSearchKoulutukset;
    hakuStore.searchOppilaitokset = mockSearchOppilaitokset;

    hakuStore.koulutusCount = 40;
    hakuStore.paging.pageKoulutus = 1;
    hakuStore.loadNextPage();
    expect(hakuStore.paging.pageKoulutus).toEqual(2);
    expect(mockSearchKoulutukset.mock.calls.length).toEqual(1);

    hakuStore.toggle = 'oppilaitos';
    hakuStore.oppilaitosCount = 60;
    hakuStore.paging.pageOppilaitos = 2;
    hakuStore.loadNextPage();
    expect(hakuStore.paging.pageOppilaitos).toEqual(3);
    expect(mockSearchOppilaitokset.mock.calls.length).toEqual(1);
  });
});

describe('HakuStore.loadPrevPage', () => {
  it('should do nothing if first page', () => {
    expect.assertions(2);
    const hakuStore = new HakuStore(null);
    hakuStore.koulutusCount = 40;
    hakuStore.paging.pageKoulutus = 1;
    hakuStore.loadPrevPage();
    expect(hakuStore.paging.pageKoulutus).toEqual(1);

    hakuStore.toggle = 'oppilaitos';
    hakuStore.oppilaitosCount = 60;
    hakuStore.paging.pageOppilaitos = 1;
    hakuStore.loadPrevPage();
    expect(hakuStore.paging.pageOppilaitos).toEqual(1);
  });

  it('should change to previous page if not last', () => {
    expect.assertions(4);
    const hakuStore = new HakuStore(null);

    const mockSearchKoulutukset = jest.fn();
    const mockSearchOppilaitokset = jest.fn();

    hakuStore.searchKoulutukset = mockSearchKoulutukset;
    hakuStore.searchOppilaitokset = mockSearchOppilaitokset;

    hakuStore.koulutusCount = 40;
    hakuStore.paging.pageKoulutus = 2;
    hakuStore.loadPrevPage();
    expect(hakuStore.paging.pageKoulutus).toEqual(1);
    expect(mockSearchKoulutukset.mock.calls.length).toEqual(1);

    hakuStore.toggle = 'oppilaitos';
    hakuStore.oppilaitosCount = 60;
    hakuStore.paging.pageOppilaitos = 3;
    hakuStore.loadPrevPage();
    expect(hakuStore.paging.pageOppilaitos).toEqual(2);
    expect(mockSearchOppilaitokset.mock.calls.length).toEqual(1);
  });
});

describe('HakuStore.isLastPage', () => {
  it('true when last page', () => {
    expect.assertions(2);
    const hakuStore = new HakuStore(null);
    hakuStore.koulutusCount = 40;
    hakuStore.paging.pageKoulutus = 2;

    expect(hakuStore.isLastPage).toEqual(true);

    hakuStore.paging.pageKoulutus = 1;
    hakuStore.toggle = 'oppilaitos';
    hakuStore.oppilaitosCount = 60;
    hakuStore.paging.pageOppilaitos = 3;

    expect(hakuStore.isLastPage).toEqual(true);
  });

  it('false when not last page', () => {
    expect.assertions(2);
    const hakuStore = new HakuStore(null);
    hakuStore.koulutusCount = 60;
    hakuStore.paging.pageKoulutus = 2;

    expect(hakuStore.isLastPage).toEqual(false);

    hakuStore.paging.pageKoulutus = 4;
    hakuStore.toggle = 'oppilaitos';
    hakuStore.oppilaitosCount = 80;
    hakuStore.paging.pageOppilaitos = 3;

    expect(hakuStore.isLastPage).toEqual(false);
  });
});

describe('HakuStore.isFirstPage', () => {
  it('true when first page', () => {
    expect.assertions(2);
    const hakuStore = new HakuStore(null);
    hakuStore.paging.pageKoulutus = 1;

    expect(hakuStore.isLastPage).toEqual(true);

    hakuStore.paging.pageKoulutus = 2;
    hakuStore.toggle = 'oppilaitos';
    hakuStore.paging.pageOppilaitos = 1;

    expect(hakuStore.isLastPage).toEqual(true);
  });

  it('false when not first page', () => {
    expect.assertions(2);
    const hakuStore = new HakuStore(null);
    hakuStore.paging.pageKoulutus = 2;

    expect(hakuStore.isLastPage).toEqual(false);

    hakuStore.paging.pageKoulutus = 1;
    hakuStore.toggle = 'oppilaitos';
    hakuStore.paging.pageOppilaitos = 3;

    expect(hakuStore.isLastPage).toEqual(false);
  });
});
