import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import '../../assets/styles/components/_hakutulos-toggle.scss';
import {translate} from 'react-i18next';

@translate()
@inject("hakuStore")
@observer
class HakutulosToggle extends Component {

    constructor(props) {
        super(props);
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.toggle = this.toggle.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }

    handleKeyPress(e) {
        e.key === "Enter" && 
           this.toggle(e,e.target.id);
    }

    toggle(event, toggle) {
        const search = qs.parse(this.props.history.location.search);
        search.toggle = toggle;
        event.preventDefault();
        this.props.history.replace({search: qs.stringify(search)});
    }

    render() {
        const {t} = this.props;
        return <div className="row tabs-result">
        <div className="col-12">
            <ul className="toggle-tabs"> 
                <li role="button" id="koulutus" tabIndex="0" aria-label={`${t('haku.koulutukset')} ${this.props.hakuStore.koulutusCount}`}  className={this.props.hakuStore.toggleKoulutus ? "valittu" : ""} onClick={(e) => {this.toggle(e, 'koulutus')}} onKeyPress={this.handleKeyPress}>
                    <div className="KoulutuksetOppilaitokset" >
                        <span >{t('haku.koulutukset')}</span>
                        <span className="Hakutulos_pallo">({this.props.hakuStore.koulutusCount})</span>
                    </div>
                </li>
                <li role="button" id="oppilaitos" tabIndex="0" aria-label={`${t('haku.oppilaitokset')} ${this.props.hakuStore.oppilaitosCount}`} className={this.props.hakuStore.toggleKoulutus ? "" : "valittu"} onClick={(e) => {this.toggle(e, 'oppilaitos')}} onKeyPress={this.handleKeyPress}>
                    <div className="KoulutuksetOppilaitokset" >
                        <span>{t('haku.oppilaitokset')}</span>
                        <span className="Hakutulos_pallo">({this.props.hakuStore.oppilaitosCount})</span>
                    </div>
                </li>
            </ul>
        </div>
        </div>;
    }
}

export default withRouter(HakutulosToggle);