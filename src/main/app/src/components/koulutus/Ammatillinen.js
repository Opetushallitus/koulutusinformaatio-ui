import React, { Component } from 'react';
import {inject} from 'mobx-react';
import KoulutusInfoBox from './KoulutusInfoBox';
import OppilaitosList from './OppilaitosList';
import KoulutusHeader from './KoulutusHeader';
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
        fields.push([t('koulutus.laajuus'), opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);
        const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.result.suunniteltuKestoTyyppi);
        fields.push([t('koulutus.suunniteltu-kesto'), suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push([t('koulutus.maksullinen'), this.props.result.opintojenMaksullisuus ? t('kyllä') : t('ei')]);
        fields.push([t('koulutus.tutkintonimikkeet'), this.props.result.tutkintonimikes ? this.props.result.tutkintonimikes.map(t => l.localize(t) + " ") : '-']);

        return fields;
    }

    render() {
        const {t} = this.props;
        const koulutusohjelma = l.localize(this.props.result.koulutusohjelma, undefined);
        const osaamisala = this.props.result.osaamisala ? l.localize(this.props.result.osaamisala.meta, undefined).nimi : undefined;
        const osaamisalat = koulutusohjelma ? koulutusohjelma : osaamisala;
        const hattu = this.props.muu ? "muu-hattu" : "ammatillinen-hattu";
        const kuvaus = this.state.kuvaus ? this.state.kuvaus.kuvaus : undefined;
        return (
            <React.Fragment>
                <KoulutusHeader hattu={hattu} nimi={this.props.result.nimi}/>
                <Media query="(max-width: 992px)">
                                {
                                    matches => matches ? (
                                        <SideBarMenu items={this.props.items} item={this.props.item}/>    
                            ):null}
                        </Media> 
                <KoulutusInfoBox fields={this.parseInfoBoxFields()}/>
                
                {osaamisalat && 
                    <SlideDropDown toteutus={true} content={osaamisalat} title={t('koulutus.osaamisalat')}/>
                }

                {kuvaus &&
                    <SlideDropDown koulutusKuvaus={true} content={l.localize(kuvaus)} title={t('koulutus.kuvaus')}/>
                }

                <OppilaitosList oid={this.props.oid} koulutus={this.props.result.koulutus.koodiUri} oppilaitokset={this.props.result.toteutukset} educationName={this.props.result.nimi}/>
            </React.Fragment>);
    }
}

export default Ammatillinen;