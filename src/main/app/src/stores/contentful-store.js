import { observable, action, runInAction } from 'mobx';
import superagent from 'superagent';

const initialState = {
  loading: true,
  kortit: {},
  sivu: {},
  info: {},
  asset: {},
  footer: {},
  sivuKooste: {},
  content: {},
  palvelut: {},
  valikot: {},
  ohjeetJaTuki: {},
  uutiset: {},
};

class ContentfulStore {
  @observable data = initialState;

  forwardTo = (id, nullIfUnvailable) => {
    const sivu = this.data.sivu[id] || this.data.sivuKooste[id];
    return sivu
      ? `/sivu/${sivu.slug || id}`
      : nullIfUnvailable
      ? null
      : `/sivu/poistettu`;
  };

  murupolku = (pageId) => {
    const { valikko, sivu, sivuKooste } = this.data;
    const all = Object.entries(valikko)
      .concat(Object.entries(sivu))
      .concat(Object.entries(sivuKooste));
    const page = sivu[pageId] || sivuKooste[pageId];
    const findParent = (id) => {
      const childId = (sivu[id] || sivuKooste[id] || {}).id || id;
      const parent = all.find((entry, ind) => {
        const [, item] = entry;
        return (item.linkki || []).find((i) => i.id === childId);
      });
      if (parent) {
        const [parentId, parentItem] = parent;
        return findParent(parentId).concat([parentItem]);
      } else {
        return [];
      }
    };
    const breadcrump = page ? findParent(pageId).concat([page]) : [];
    return breadcrump.map((b) => ({
      name: b.name,
      link: this.forwardTo(b.id, true),
    }));
  };

  assetUrl(url) {
    return url && `${this.urlStore.urls.url('konfo-backend.content', '')}${url}`;
  }

  static bodyAsArray(res) {
    return res.body ? res.body : [];
  }

  static reduceToKeyValue(values) {
    return values.reduce((res, value) => {
      res[value.id] = value;
      if (value.url) {
        res[value.url] = value;
      }
      if (value.slug) {
        res[value.slug] = value;
      }
      if (value.sivu?.id) {
        res[value.sivu.id] = value;
      }
      return res;
    }, {});
  }

  fetchManifest() {
    return superagent.get(
      this.urlStore.urls.url('konfo-backend.content', 'manifest.json')
    );
  }
  fetchUrl(url) {
    return superagent.get(url);
  }
  constructor(urlStore) {
    this.urlStore = urlStore;
  }

  @action
  fetchData = async (lang) => {
    if (this.data.loading) {
      this.fetchManifest()
        .then((res) => {
          return res.body || {};
        })
        .then((manifest) => {
          const contents = Object.entries(manifest).map(([k, v]) => [
            k,
            this.urlStore.urls.url('konfo-backend.content', '') + v[lang],
          ]);
          return Promise.all(
            contents.map(([key, url]) => {
              return this.fetchUrl(url)
                .then(ContentfulStore.bodyAsArray)
                .then((data) => {
                  return { [key]: ContentfulStore.reduceToKeyValue(data) };
                });
            })
          );
        })
        .then((all) => {
          runInAction(() => {
            this.data = Object.assign(...all);
          });
        });
    }
  };

  @action
  reset = (lang) => {
    this.data = initialState;
    this.fetchData(lang);
  };
}

export default ContentfulStore;
