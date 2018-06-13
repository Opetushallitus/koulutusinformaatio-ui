import React, { Component } from 'react';
import '../../assets/css/hakutulos.css'
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom'
import qs from 'query-string';
import {translate} from 'react-i18next';

@translate()
@inject("hakuStore")
@observer
class HakutulosToggle extends Component {

    toggle(event, toggle) {
        const search = qs.parse(this.props.location.search);
        search.toggle = toggle;
        event.preventDefault();
        this.props.history.replace({search: qs.stringify(search)});
    }

    render() {
        const {t} = this.props;
        return <div className="row">
            <div className="col-md-2 col-xs-12">
                <h2 className="KoulutuksetOppilaitokset" onClick={(e) => {this.toggle(e, 'koulutus')}}>
                    <span className={this.props.hakuStore.toggleKoulutus ? "Valittu" : ""}>{t('haku.koulutukset')}</span>&nbsp;
                    <span className="Hakutulos_pallo">{this.props.hakuStore.koulutusCount}</span></h2>
            </div>
            <div className="col-md-2 col-xs-12">
                <h2 className="KoulutuksetOppilaitokset" onClick={(e) => {this.toggle(e, 'oppilaitos')}}>
                    <span className={this.props.hakuStore.toggleKoulutus ? "" : "Valittu"}>{t('haku.oppilaitokset')}</span>&nbsp;
                    <span className="Hakutulos_pallo">{this.props.hakuStore.oppilaitosCount}</span></h2>
            </div>
        </div>;
    }
}

export default withRouter(HakutulosToggle);