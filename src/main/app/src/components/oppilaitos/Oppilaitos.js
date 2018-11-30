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
import OppilaitosKoulutuksetList from './OppilaitosKoulutuksetList';
import OppilaitosSidebar from './OppilaitosSidebar';
import SlideDropDown from '../common/SlideDropdown';
import SideBarMenu from '../common/SideBarMenu';
import '../../assets/styles/components/_oppilaitos.scss';

@inject("restStore")
@inject("navigaatioStore")
@translate()
@observer
class Oppilaitos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oppilaitos: undefined,
            koulutukset: undefined,
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
                                <OppilaitosKoulutuksetList oid={this.props.navigaatioStore.oid} name={actualOppilaitos}/>
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