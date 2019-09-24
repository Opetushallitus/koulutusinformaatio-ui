import React, { Component } from 'react';
import {inject} from 'mobx-react';
import KoulutusInfoBox from './KoulutusInfoBox';
import KoulutusAdditionalInfoBox from './KoulutusAdditionalInfoBox';
import KoulutusDescriptionBox from './KoulutusDescriptionBox';
import OppilaitosList from './OppilaitosList';
import SlideDropDown from '../common/SlideDropdown';
import { Localizer as l } from '../../tools/Utils';
import {translate} from 'react-i18next'
import Media from 'react-media';
import SideBarMenu from '../common/SideBarMenu';

@inject("restStore")
@translate()
class Ammatillinen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kuvaus: undefined,
        }
    };

    async componentDidMount() {
        await this.getKoulutusKuvaus();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getKoulutusKuvaus();
    }

    getKoulutusKuvaus() {
        this.props.restStore.getKoulutusKuvaus(this.props.result.koulutus.koodiUri, 'false', (k) => {
            this.setState({
                kuvaus: k
            })
        });
    }

    parseInfoBoxFields() {
        const {t} = this.props;
        const fields = [];
        // laajuus, kesto, maksullinen, tutkintonimike

        const opintojenLaajuusarvo = l.localize(this.props.result.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.result.opintojenLaajuusyksikko);
        fields.push([t('koulutus.laajuus'), opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko), "ic_toys"]);
        const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.result.suunniteltuKestoTyyppi);
        fields.push([t('koulutus.suunniteltu-kesto'), suunniteltuKesto + " " + suunniteltuKestoTyyppi, "outline-access_time"]);
        fields.push([t('koulutus.koulutusaste'), "Ammatillinen tutkinto", "ic_account_balance"]);
        fields.push([t('koulutus.tutkintonimikkeet'), this.props.result.tutkintonimikes ? this.props.result.tutkintonimikes.map(t => l.localize(t) + " ") : '-', "ic_school"]);

        return fields;
    }

    parseAdditionalInfoBoxFields() {
        const fields = [];

        const field0 = {
            title: undefined
        };
        field0.title = "Opintojen rakenne";

        const field1 = {
            title: undefined
        };
        field1.title = "Jatko-opintomahdollisuudet";

        const field2 = {
            title: undefined
        };
        field2.title = "Suuntautumisvaihtoehdot";

        const field3 = {
            title: undefined
        };
        field3.title = "Uramahdollisuudet";
        
        fields.push(field0);
        fields.push(field1);
        fields.push(field2);
        fields.push(field3);
        return fields;
    }

    render() {
        const {t} = this.props;
        const koulutusohjelma = l.localize(this.props.result.koulutusohjelma, undefined);
        const osaamisala = this.props.result.osaamisala ? l.localize(this.props.result.osaamisala.meta, undefined).nimi : undefined;
        const osaamisalat = koulutusohjelma ? koulutusohjelma : osaamisala;
        const kuvaus = this.state.kuvaus ? this.state.kuvaus.kuvaus : undefined;
        return (
            <React.Fragment>
                <Media query="(max-width: 992px)">
                                {
                                    matches => matches ? (
                                        <SideBarMenu items={this.props.items} item={this.props.item}/>    
                            ):null}
                        </Media> 
                <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>
                {kuvaus &&
                    <KoulutusDescriptionBox content={l.localize(kuvaus)}/>
                }
                {osaamisalat && 
                    <SlideDropDown toteutus={true} content={osaamisalat} title={t('koulutus.osaamisalat')}/>
                }
                <OppilaitosList oid={this.props.oid} koulutus={this.props.result.koulutus.koodiUri} oppilaitokset={this.props.result.toteutukset} educationName={this.props.result.nimi}/>
                <KoulutusAdditionalInfoBox fields={this.parseAdditionalInfoBoxFields()}/>
            </React.Fragment>);
    }
}

export default Ammatillinen;