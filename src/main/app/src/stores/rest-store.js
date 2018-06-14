import { observable, action, /*configure*/ } from "mobx"
import superagent from 'superagent';
import i18n from '../tools/i18n';

//configure({ enforceActions: true })

class RestStore {

    @observable errors = [];

    constructor(urlStore) {
        this.urlStore = urlStore;
    }

    @action
    handleError = (e) => {
        console.log(e);
        this.errors.push(e);
    };

    @action
    searchKoulutuksetPromise = (keyword, paging, filter) => {
        return (superagent
            .get(this.urlStore.urls.url('konfo-backend.search.koulutukset'))
            .query({keyword: keyword,
                page: paging.pageKoulutus,
                size: paging.pageSize,
                paikkakunta: filter.paikkakunta,
                koulutustyyppi: filter.koulutus.join(','),
                kieli: filter.kieli.map((k) => 'kieli_' + k).join(','),
                lng: i18n.language})
            .catch(this.handleError))
    };

    @action
    searchOppilaitoksetPromise = (keyword, paging, filter) => {
        return (superagent
            .get(this.urlStore.urls.url('konfo-backend.search.oppilaitokset'))
            .query({keyword: keyword,
                page: paging.pageOppilaitos,
                size: paging.pageSize,
                paikkakunta: filter.paikkakunta,
                koulutustyyppi: filter.koulutus.join(','),
                kieli: filter.kieli.map((k) => 'kieli_' + k).join(','),
                lng: i18n.language})
            .catch(this.handleError))
    };

    @action
    search = (promises, resultAction) => {
        const _this = this;
        Promise.all(promises).then((result) => {
            resultAction(result.map(r => r.body))
        }).catch(_this.handleError);
    };

    @action
    getKoulutus = (oid, onSuccess) => {
        superagent
            .get(this.urlStore.urls.url('konfo-backend.koulutus') + oid)
            .end((err, res) => {
                if(err) {
                    this.handleError(err)
                } else {
                    const koulutus = ( res.body.result && res.body.result.koulutus ) ? res.body.result.koulutus[oid] : undefined;
                    onSuccess(koulutus)
                }
            });
    };

    @action
    getOppilaitos = (oid, onSuccess) => {
        superagent
            .get(this.urlStore.urls.url('konfo-backend.oppilaitos') + oid)
            .end((err, res) => {
                if(err) {
                    this.handleError(err)
                } else {
                    onSuccess(res.body.result)
                }
            });
    };
}

export default RestStore;