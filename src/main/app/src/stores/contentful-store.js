import { observable, action, runInAction } from 'mobx';
import { Localizer as l } from '../tools/Utils';
import superagent from 'superagent';

class ContentfulStore {
  @observable data = {
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

  forwardTo = (id) => {
    const sivu = this.data.sivu[id] || this.data.sivuKooste[id];
    return sivu ? `/sivu/${sivu.slug || id}` : `/sivu/poistettu`;
  };

  assetUrl(url) {
    return `${this.urlStore.urls.url('konfo-backend.content', '')}${url}`;
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
  constructor(locale, urlStore) {
    this.locale = l.getLanguage();
    this.urlStore = urlStore;
  }
  @action
  fetchData = async () => {
    if (this.data.loading) {
      this.fetchManifest()
        .then((res) => {
          return res.body || {};
        })
        .then((manifest) => {
          const contents = Object.entries(manifest).map(([k, v]) => [
            k,
            this.urlStore.urls.url('konfo-backend.content', '') +
              v[this.locale],
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
}

export default ContentfulStore;
