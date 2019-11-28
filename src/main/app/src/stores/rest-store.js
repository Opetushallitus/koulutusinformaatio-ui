import { observable, action /*configure*/ } from 'mobx';
import superagent from 'superagent';
import { Localizer as l } from '../tools/Utils';

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
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.search.koulutukset'))
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .query({
        keyword: keyword,
        page: paging.pageKoulutus,
        size: paging.pageSize,
        paikkakunta: filter.paikkakunta,
        koulutustyyppi: filter.koulutus.join(','),
        opetuskieli: filter.kieli.map((k) => k).join(','),
        lng: l.getLanguage(),
      })
      .catch(this.handleError);
  };

  @action
  searchOppilaitoksetPromise = (keyword, paging, filter) => {
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.search.oppilaitokset'))
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .query({
        keyword: keyword,
        page: paging.pageOppilaitos,
        size: paging.pageSize,
        paikkakunta: filter.paikkakunta,
        koulutustyyppi: filter.koulutus.join(','),
        //kieli: filter.kieli.map((k) => k).join(','),
        lng: l.getLanguage(),
      })
      .catch(this.handleError);
  };

  @action
  search = (promises, resultAction) => {
    const _this = this;
    Promise.all(promises)
      .then((result) => {
        resultAction(result.map((r) => r.body));
      })
      .catch(_this.handleError);
  };

  @action
  getKoulutus = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.koulutus') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const koulutus = res.body ? res.body : undefined;
          onSuccess(koulutus);
        }
      });
  };

  @action
  getKoulutusKuvaus = (oid, osaamisalakuvaukset, onSuccess) => {
    oid = oid.substring(0, oid.indexOf('#'));
    superagent
      .get(this.urlStore.urls.url('konfo-backend.koulutus.kuvaus') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .query({ osaamisalakuvaukset: osaamisalakuvaukset })
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const kuvaus = res.body ? res.body : undefined;
          onSuccess(kuvaus);
        }
      });
  };

  @action
  getToteutus = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.toteutus') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const koulutus = res.body ? res.body : undefined;
          const organisaatio =
            res.body && res.body.organisaatio
              ? res.body.organisaatio
              : undefined;
          onSuccess(koulutus, organisaatio);
        }
      });
  };

  @action
  getOppilaitos = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.oppilaitos') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          onSuccess(res.body.result);
        }
      });
  };

  @action
  getHaku = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.haku') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const haku = res.body ? res.body : undefined;
          onSuccess(haku);
        }
      });
  };

  @action
  getHakukohde = (oid, onSuccess) => {
    superagent
      .get(this.urlStore.urls.url('konfo-backend.hakukohde') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui')
      .end((err, res) => {
        if (err) {
          this.handleError(err);
        } else {
          const hakukohde = res.body ? res.body : undefined;
          onSuccess(hakukohde);
        }
      });
  };

  @action
  getToteutusPromise = (oid) => {
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.toteutus') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui');
  };

  @action
  getOppilaitosPromise = (oid) => {
    return superagent
      .get(this.urlStore.urls.url('konfo-backend.oppilaitos') + oid)
      .set('Caller-Id', '1.2.246.562.10.00000000001.konfoui');
  };
}

export default RestStore;
