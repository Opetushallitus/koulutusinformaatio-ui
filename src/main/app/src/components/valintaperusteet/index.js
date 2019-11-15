import React, { Component } from 'react';
import {inject} from 'mobx-react';
import Hakukohde from './Hakukohde';
import ValintaperusteKuvaus from './ValintaperusteKuvaus';
import KouluMenestysKuvaus from './KouluMenestysKuvaus';
import Valintakokeet from './Valintakokeet';
import TerveydentilaKuvaus from './TerveydentilaKuvaus';
import HaeKoulutukseen from './HaeKoulutukseen';
import {translate} from 'react-i18next'
import '../../assets/styles/components/_valintaperuste-page.scss';

@inject("restStore")
@translate()
class Valintaperusteet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hakukohde: undefined,
        }
    };

    async componentDidMount() {
        await this.getHakukohde();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getHakukohde();
    }

    getHakukohde() {
        this.props.restStore.getHakukohde(this.props.location.state.valintaperusteOid, (k) => {
            this.setState({
                hakukohde: k
            })
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="valintaperuste-wrapper">
                    <h1 className="valintaperuste-header-title">Valintaperusteet</h1>
                    <Hakukohde />
                    <ValintaperusteKuvaus />
                    <KouluMenestysKuvaus />
                    <Valintakokeet />
                    <TerveydentilaKuvaus />
                    <HaeKoulutukseen />
                </div>
            </React.Fragment>);
    }
}

export default Valintaperusteet;