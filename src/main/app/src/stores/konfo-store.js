import UrlStore from './url-store';
import HakuStore from './haku-store';
import HakuehtoStore from './hakuehto-store';
import RestStore from './rest-store';
import NavigaatioStore from './navigaatio-store';

class KonfoStore {
    constructor() {
        this.urlStore = new UrlStore();
        this.restStore = new RestStore(this.urlStore);
        this.hakuStore = new HakuStore(this.restStore);
        this.hakuehtoStore = new HakuehtoStore();
        this.navigaatioStore = new NavigaatioStore(this.hakuStore);
    }
}

export default KonfoStore;