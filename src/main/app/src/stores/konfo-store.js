import UrlStore from './url-store';
import HakuStore from './haku-store';
import HakuehtoStore from './hakuehto-store';
import RestStore from './rest-store';
import NavigaatioStore from './navigaatio-store';
import VertailuStore from './vertailu-store';
import ContentfulStore from './contentful-store';
import { Localizer as l } from '../tools/Utils';
import i18n from 'i18next';

class KonfoStore {
  constructor() {
    this.urlStore = new UrlStore();
    this.restStore = new RestStore(this.urlStore);
    this.hakuStore = new HakuStore(this.restStore);
    this.hakuehtoStore = new HakuehtoStore();
    this.contentfulStore = new ContentfulStore(this.urlStore);
    i18n.on('languageChanged', async (lng) => {
      this.contentfulStore.reset(l.getLanguage() || 'fi');
    });

    this.urlStore.loadFrontProperties();
    this.navigaatioStore = new NavigaatioStore(this.hakuStore, this.hakuehtoStore);
    this.vertailuStore = new VertailuStore(this.hakuStore, this.restStore);
  }
}

export default KonfoStore;
