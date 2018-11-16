import React, {Component} from 'react';
import {inject} from "mobx-react";
import {Localizer as l} from "../../tools/Utils";
import {Link} from "react-router-dom";
import {translate} from "react-i18next";

@translate()
@inject("restStore")
@inject("hakuStore")
class ToteutusSidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oppilaitos: undefined
        };
    }

    async componentDidMount() {
        await this.getOppilaitosTiedot();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getOppilaitosTiedot();
    }

    getOppilaitosTiedot() {
        this.props.restStore.getOppilaitos(this.props.oid, (o) => {
            this.setState({
                oppilaitos: o
            })
        });
    }

    findSahkopostiosoite() {
        for (let row of this.props.organisaatio.yhteystiedot){
            if (row.email) {
                return row.email;
            }
        }
        return undefined;
    }

    findPuhelinnumero() {
        for (let row of this.props.organisaatio.yhteystiedot){
            if(row.tyyppi === "puhelin" && row.numero) {
                return row.numero;
            }
        }
        return undefined;
    }

    findKotisivu() {
        for (let row of this.props.organisaatio.yhteystiedot){
            if(row.www) {
                return row.www;
            }
        }
        return undefined;
    }

    parsePostinumeroUri() {
        const uri = this.props.organisaatio.kayntiosoite.postinumeroUri;
        return uri ? uri.substring(6,uri.length) : '';
    }

    render() {
        const {t} = this.props;
        const org = this.props.organisaatio;
        const oid = org ? this.props.organisaatio.oid : undefined;
        const link = oid ? '/oppilaitos/' + this.props.organisaatio.oid + '?haku=' +
            encodeURIComponent(this.props.hakuStore.createHakuUrl)
            + '&lng=' + l.getLanguage() : undefined;
        const osoite = org ? this.props.organisaatio.kayntiosoite.osoite : undefined;
        const postitoimipaikka = org ? this.props.organisaatio.kayntiosoite.postitoimipaikka : undefined;
        const postinumero = org ? this.parsePostinumeroUri() : undefined;
        const sahkopostiosoite = org ? this.findSahkopostiosoite() : undefined;
        const puhelinnumero = org ? this.findPuhelinnumero() : undefined;
        const kotisivu = org ? this.findKotisivu() : undefined;
        var tutkintonimikkeet = this.props.koulutus && this.props.koulutus.tutkintonimikes ? this.props.koulutus.tutkintonimikes : [];
        if(tutkintonimikkeet.length === 0 && this.props.koulutus && this.props.koulutus.tutkintonimike) {
            tutkintonimikkeet.push(this.props.koulutus.tutkintonimike);
        }
        const hae = this.props.koulutus && this.props.koulutus.hakuajatFromBackend ? this.props.koulutus.hakuajatFromBackend.aktiiviset.length > 0 : false;
        return (
            <div className="col-12 col-md-3 right-column">
                <div className="row">
                    <div className="toteutus-sidebar">
                        <div className='col-md-12'>
                            <h1 id="toteutus-side-header">{l.localize(this.props.organisaatio, "", "Tuntematon oppilaitos")}</h1>
                            <Link role="button" to={{
                                pathname: link
                            }} className="btn btn-primary tutustu-button" onClick={() => {this.closeRajain()}}>{t('toteutus.tutustu')}</Link>
                        </div>
                        <div className='col-md-12'>
                            <h2>{t('toteutus.yhteystiedot')}</h2>
                            <span>{osoite}</span>
                            <span>{postinumero + ' ' + postitoimipaikka}</span>
                            <span>{sahkopostiosoite ? <a className="email" href={"mailto:" + sahkopostiosoite}>{sahkopostiosoite}</a> : t('toteutus.ei-sähköpostia')}</span>
                            <span>{t('toteutus.puhelin') + ' ' + puhelinnumero}</span>
                        </div>
                        <div className='col-md-12'>
                            {kotisivu ? <a className="homepage" target="_blank" href={kotisivu}><span>{t('toteutus.kotisivu')}</span></a> : <span>{t('toteutus.ei-kotisivua')}</span>}
                        </div>
                        <hr className="col-md-12"/>
                        <div className='col-md-12'>
                            <dl>
                                <dt><h2>{t('toteutus.tutkintonimikkeet')}</h2></dt>
                                {tutkintonimikkeet.map((tn, i) => <dd key={i}><span>{l.localize(tn, '')}</span></dd>)}
                            </dl>
                        </div>
                        {hae && <div className='col-md-12 hae'>
                            <span className='hae-koulutukseen'>{t('toteutus.hae-koulutukseen')}</span>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}

export default ToteutusSidebar;




