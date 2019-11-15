import React, {Component} from 'react';
import {inject} from "mobx-react";
import {Localizer as l} from "../../tools/Utils";
import ContactInfoRow from '../common/ContactInfoRow';
import ActionButton from '../common/ActionButton';
import '../../assets/styles/components/_hakukohde-sidebar.scss';

@inject("restStore")
@inject("hakuStore")
class HakukohdeSidebar extends Component {

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
        this.props.restStore.getOppilaitos(this.props.organisaatio.oid, (o) => {
            this.setState({
                oppilaitos: o
            })
        });
    }
    
    render() {
        const {t} = this.props;
        const org = this.props.organisaatio;
        const oid = org ? this.props.organisaatio.oid : undefined;
        const link = oid ? '/oppilaitos/' + this.props.organisaatio.oid + '?haku=' +
            encodeURIComponent(this.props.hakuStore.createHakuUrl)
            + '&lng=' + l.getLanguage() : undefined;
        const educationType = this.props.educationType || "muu";    
        var tutkintonimikkeet = this.props.koulutus && this.props.koulutus.tutkintonimikes ? this.props.koulutus.tutkintonimikes : [];
        if(tutkintonimikkeet.length === 0 && this.props.koulutus && this.props.koulutus.tutkintonimike) {
            tutkintonimikkeet.push(this.props.koulutus.tutkintonimike);
        }
        const hae = this.props.koulutus && this.props.koulutus.hakuajatFromBackend ? this.props.koulutus.hakuajatFromBackend.aktiiviset.length > 0 : false;
        return (
            <div className="col-12 col-md-12 col-lg-4 col-xl-3 right-column">
                <div className="hakukohde-sidebar">
                    <div className='col-md-12'>
                        <h2 id="toteutus-side-header">{l.localize(this.props.organisaatio, "", "Tuntematon oppilaitos")}</h2>
                        <ActionButton type="react-link" address={link}/>
                    </div>
                    <div className='col-md-12'>
                        <h3>{t('toteutus.yhteystiedot')}</h3>
                        <ContactInfoRow name={l.localize(this.props.organisaatio)} data={this.state.oppilaitos} type="toteutus" educationType={educationType}/>
                    </div>
                    <hr className="col-md-12"/>
                    <div className='col-md-12'>
                        <dl>
                            <dt><h3>{t('toteutus.tutkintonimikkeet')}</h3></dt>
                            {tutkintonimikkeet.map((tn, i) => <dd key={i}><span>{l.localize(tn, '')}</span></dd>)}
                        </dl>
                    </div>
                    {hae && <div className='col-md-12 hae'>
                        <span className='hae-koulutukseen'>{t('toteutus.hae-koulutukseen')}</span>
                    </div>}
                </div>
            </div>
        );
    }
}

export default HakukohdeSidebar;




