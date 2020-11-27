import { observable, action, runInAction } from 'mobx';
import { urls as ophUrls } from 'oph-urls-js';
import { production, development } from '../urls/urls';
import superagent from 'superagent';

// TODO: This content should be refactored to somewhere else
class UrlStore {
  @observable urls = ophUrls;
  @observable loading = true;

  isTest() {
    return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  }

  @action
  async loadFrontProperties() {
    try {
      const url = '/konfo/rest/config/frontProperties';
      const frontProperties = await (this.isTest()
        ? Promise.resolve({
            'konfo-backend.content': 'https://konfo-content.untuvaopintopolku.fi/$1',
          })
        : superagent
            .get(url)
            .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
            .then((res) => res.body));
      runInAction(() => {
        this.urls.addOverrides(frontProperties);
        this.loading = false;
      });
    } catch (error) {
      console.error('Asetusten lukeminen palvelimelta epäonnistui!', error);
    }
  }

  constructor(konfoStore) {
    console.log('Ollaan ympäristössä ' + process.env.NODE_ENV);
    this.urls.addProperties(this.isTest() ? development : production);
  }
}

export default UrlStore;
