import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import {Localizer as l} from '../../tools/Utils';
import HakutulosToggleWrapper from "./HakutulosToggleWrapper";
import HakutulosSummary from "./HakutulosSummary";
import HakutulosBox from "../common/HakutulosBox";
import Sivutus from './Sivutus';
import { translate } from 'react-i18next';
import VertailuBox from "./VertailuBox";
import '../../assets/styles/components/_hakutulos.scss';

@translate()
@inject("hakuStore", "vertailuStore")
@observer
class Hakutulos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleKoulutus : undefined
        }
    }

    updateState(){
        this.setState({
            toggleKoulutus : true
        })
    }

   componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.updateState();
    }

    componentDidMount(nextProps) {
        this.props = nextProps;
    }

    getKoulutusNimi(koulutus) {
        return l.localize(koulutus, this.props.t("koulutus.ei-nimeä"), 'fi');
    }

    getKoulutusAiheet(koulutus) {
        if(koulutus.aiheet && (0 < koulutus.aiheet.length)) {
            return koulutus.aiheet.map(a => l.localize(a, null)).filter(a => a != null).join(', ');
        }
        return "";
    }

    getOppilaitosNimi(oppilaitos) {
        return l.localize(oppilaitos, this.props.t("oppilaitos.ei-nimeä"), 'fi');
    }

    getOsaamisala(koulutus) {
        const osaamisala = l.localize(koulutus.osaamisala, undefined);
        if(osaamisala) {
            return osaamisala;
        }
        const koulutusohjelma = l.localize(koulutus.koulutusohjelma, undefined);
        if(koulutusohjelma) {
            return koulutusohjelma;
        }
        return "";
    }

    renderResultList() {
        const vertailuActive = this.props.vertailuStore.size < 3;
        if(this.props.hakuStore.toggleKoulutus) {
            return this.props.hakuStore.koulutusResult.map((r) => {
                const link = '/koulutus/' + r.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl)
                                                    + '&lng=' + l.getLanguage();
                return (
                    
                    <HakutulosBox key={r.oid}
                                  oid={r.oid}
                                  vertailuOid={r.oid}
                                  tyyppi={r.koulutustyyppi}
                                  haettavissa={r.hakuOnKaynnissa}
                                  nimi={this.getKoulutusNimi(r)}
                                  link={link}
                                  text1={this.getOsaamisala(r)}//osaamisalat = ammattinimikkeet ammatillisessa? entä miten kk ylempi/alempi tarkistetaan?
                                  text2={""}
                                  vertailu={vertailuActive}/>)
            });
        } else {
            if(!this.props.hakuStore.oppilaitosResult){
                return;
            }
            return this.props.hakuStore.oppilaitosResult.map((r) => {
                const link = '/oppilaitos/' + r.oid + '?haku=' + encodeURIComponent(this.props.hakuStore.createHakuUrl)
                                                    + '&lng=' + l.getLanguage();
                return (
                    <HakutulosBox key={r.oid}
                                  oid={r.oid}
                                  tyyppi={r.tyyppi}
                                  haettavissa={false}
                                  nimi={this.getOppilaitosNimi(r)}
                                  link={link}
                                  text1={r.kayntiosoite ? r.kayntiosoite : ""}
                                  text2={r.postitoimipaikka ? r.postitoimipaikka : ""}
                                  vertailu={false}/>)
            })
        }
    }

    render() {
        const {t} = this.props;
        if(!this.props.hakuStore.keywordSet && !this.props.hakuStore.filterSet) {
            return (
                <React.Fragment>
                    <div className="container">
                        <div className="row result-count">
                            <div className="col-12">
                                <h1 aria-live="assertive">{t('haku.lisää-hakusana-tai-rajain')}</h1>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <VertailuBox/>
                <div id="hakutulos-content">
                    <div className="container">
                        <HakutulosSummary iDidUpdate={this.props.iUpdatedMyChildren}/>
                    </div>
                    <div className="container" id="toggle-tabs">
                        <HakutulosToggleWrapper/>
                    </div>
                    <div className="container search-results" id="search-results">
                        <div className="row">
                            {this.renderResultList()}
                        </div>
                    </div>
                    <Sivutus/>
                </div>
                
            </React.Fragment>
        );
    }
}

export default Hakutulos;
