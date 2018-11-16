import React, { Component } from 'react';
import Hakunavigaatio from '../hakutulos/Hakunavigaatio';
import Media from 'react-media';
import {observer, inject} from 'mobx-react';
import OppilaitosHeaderImage from './OppilaitosHeaderImage';
import PageLikeBox from '../common/PageLikeBox';
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next';
import { Localizer as l } from "../../tools/Utils";
import OppilaitosArvostelut from './OppilaitosArvostelut';
import OppilaitosKoulutukset from './OppilaitosKoulutukset';
import OppilaitosSidebar from './OppilaitosSidebar';
import SlideDropDown from '../common/SlideDropdown';
import SideBarMenu from '../common/SideBarMenu';

@inject("restStore")
@inject("navigaatioStore")
@translate()
@observer
class Oppilaitos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oppilaitos: undefined,
            selectedMenuItem: 0
        };
        this.getSelectedItem=this.getSelectedItem.bind(this);
        this.setSelectedItem=this.setSelectedItem.bind(this);
    }

    async componentDidMount() {
        await this.getOppilaitosTiedot();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getOppilaitosTiedot();
    }

    getKotisivuFromYhteystiedot() {
        const data = this.state.oppilaitos.yhteystiedot;

        for (let row in data){
            if(row.www) {
                return (
                    <a href={row.www}><i className='fa fa-external-link'> </i>{this.props.t('oppilaitos.verkkosivu')}</a>
                )
            }
        }
        return "";
    }

    getOppilaitosTiedot() {
        this.props.navigaatioStore.setOid(this.props.match.params.oid);
        this.props.restStore.getOppilaitos(this.props.navigaatioStore.oid, (o) => {
            this.setState({
                oppilaitos: o
            })
        }); 
    }

    getSelectedItem(i){
        this.setState({
            selectedMenuItem: i
        })
    }

    setSelectedItem(){
        return this.state.selectedMenuItem;
    }

    //Todo: Selvitä, onko tämä ylipäänsä järkevää
    getEmailFromYhteystiedot() {
        const data = this.state.oppilaitos.yhteystiedot;
        let emailValue = "";
        for(let i = 0; i<data.length; i++){
            if(data[i].email){
                emailValue = data[i].email;
                return emailValue;
            }
        }
        return this.props.t("oppilaitos.ei-sähköpostiosoitetta");
    }
    
    safeParseYleiskuvaus() {
        const data = this.state.oppilaitos;
        const kieli = l.getLanguage();
        if(data && data.yleiskuvaus && data.yleiskuvaus["kieli_" + kieli + "#1"])
            return <div>{renderHTML(data.yleiskuvaus["kieli_" + kieli + "#1"])}</div>
        return "";
    }

    parseSome() {
        
        if (!this.state.oppilaitos.metadata || !this.state.oppilaitos.metadata.data)  {
            return <div className='social'/>;
        }
        const data = this.state.oppilaitos.metadata.data;
        let fb = "";
        let twitter = "";
        let insta = "";

        for (let i = 1; i < 10; i++) {
            const key = "sosiaalinenmedia_"+i+"#1";
            if(data[key]) {
                const k = data[key];
                const kieli = "kieli_" + l.getLanguage() + "#1";
                if(k[kieli]) {
                    if(k[kieli].indexOf('facebook') !== -1 ) {
                        fb = <li><a href={k[kieli]}><i className='fa fa-facebook-square fa-3x' /></a></li>
                    } else if (k[kieli].indexOf('twitter') !== -1) {
                        twitter = <li><a href={k[kieli]}><i className='fa fa-twitter-square fa-3x' /></a></li>
                    } else if (k[kieli].indexOf('instagram') !== -1) {
                        insta = <li><a href={k[kieli]}><i className='fa fa-instagram fa-3x' /></a></li>
                    }
                }
            }
        }
        return (
            <ul className='social'>
                {fb}
                {twitter}
                {insta}
            </ul>
        )
    }

    render() {
        let selectedItem= this.setSelectedItem();
        const menuElements = [
            "Esittely",
            "Yhteystiedot",
            "Koulutukset",
            "Arvostelut"
        ];
        const actualOppilaitos = this.state.oppilaitos !== undefined ?  l.localize(this.state.oppilaitos.nimi, "", "fi") : "Nimi";
        const emailAddress = this.state.oppilaitos !== undefined ? this.getEmailFromYhteystiedot() : "";
        const ratingStars = [{"star": 1},{"star": 1},{"star": 1},{"star": 0.5},{"star": 0}];
        if(!this.state.oppilaitos) {
            return null;
        }
        return (
            <React.Fragment>                
                <div className="container" id="oppilaitos-container">
                    <div className="row">   
                        <Media query="(min-width: 992px)">
                                {
                                    matches => matches ? (
                                        <OppilaitosSidebar items={menuElements} name={actualOppilaitos} selected={selectedItem} item={this.getSelectedItem} ratingStars={ratingStars}></OppilaitosSidebar>
                                    ): null
                                }
                        </Media> 
                        <div className="col-12 col-md-12 col-lg-8 col-xl-9">
                            <div className="header-image">
                                <OppilaitosHeaderImage />
                            </div>
                            <PageLikeBox type="link" text="Lähetä sähköpostia" name={actualOppilaitos} address={emailAddress}></PageLikeBox>
                            <Media query="(max-width: 992px)">
                                {
                                    matches => matches ? (
                                        <React.Fragment>
                                            <OppilaitosArvostelut ratingStars={ratingStars}/>
                                            <SideBarMenu items={menuElements} selected={selectedItem} item={this.getSelectedItem} />
                                        </React.Fragment>
                                    ): null
                                }
                            </Media> 
                            { selectedItem !==2 &&
                                <div className="esittely">
                                    <SlideDropDown title="Esittely" text={true}></SlideDropDown>
                                    <SlideDropDown title="Yhteystiedot"  name={actualOppilaitos} yhteystiedot={true} data={this.state.oppilaitos || ""}></SlideDropDown>
                                </div>
                            }
                            { selectedItem === 2 &&
                                <OppilaitosKoulutukset/>
                            }
                        </div>
                    </div>
                </div>
                <Hakunavigaatio/>
            </React.Fragment>
        );
    }
}

export default Oppilaitos;