import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import '../../assets/styles/components/_slide-dropdown.scss';
import {Localizer as l} from '../../tools/Utils';
import OppilaitosListItem from '../koulutus/OppilaitosListItem';
import OsaamisalaListItem from '../toteutus/OsaamisalaListItem';
import ValintakokeetListItem from '../hakukohde/ValintakokeetListItem'
import OskariKartta from "../oppilaitos/OskariKartta";
import ContactInfoRow from '../common/ContactInfoRow';


class SlideDropdown extends Component{
    
    constructor(props) {
        super(props)
        this.state = {
          viewContentState: false,
          isCollapsing: false,
          textContent: () => {
            return <div className="col-11 text-block"><p>Opintopolku-portaalia ylläpitää Opetushallitus. Suomalaiset oppilaitokset ja korkeakoulut ylläpitävät Opintopolussa omien koulutustensa tietoja. Opintopolku.fi-palvelussa voi:</p> <ul> <li>Selailla eri aloja ja tutkintoja</li> <li>Saada tietoa opinnoista</li> <li>Etsiä ajankohtaisia koulutuksia</li> <li>Tutustua valintaperusteisiin</li> <li>Hakea koulutuksiin</li> <li>Katsoa videoita ja lukea tarinoita opiskelijoiden omista kokemuksista.</li> </ul> <p>Opintopolku.fi -palvelu on sähköinen palvelukokonaisuus, josta löytyy kattavasti koulutuksen ja opetuksen järjestäjän palveluita. Palvelujen käyttäjiä ovat esimerkiksi koulutukseen hakeutujat, opiskelijat, oppilaitokset, yritykset sekä julkishallinto.</p> <p>Opintopolku.fi -palvelu tarjoaa kansalaiselle helppokäyttöisiä, luotettavia ja turvallisia palveluita elinikäisen ja yksilöllisen oppimispolun suunnitteluun ja toteuttamiseen.</p> <p>Opintopolku on kokonaisuudessaan sähköinen palvelukokonaisuus myös koulutuksen ja opetuksen järjestäjille.</p></div>;
          }
        }
        this.toggleClass = this.toggleClass.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this); 
    }

    toggleClass() {
        if(!!this.state.viewContentState) {
            this.setState({
                isCollapsing: true
            });
            setTimeout(()=> {
                this.setState({ 
                    viewContentState: !this.state.viewContentState,
                    isCollapsing: false
               });
            },180); 
        } else {
            this.setState({ 
                viewContentState: !this.state.viewContentState 
            });
        }              
    }

    handleKeyPress(e) {
        e.key === "Enter" && 
        this.toggleClass();
    }

    luoKarttaJosOsoiteTiedossa() {
        const data = this.props.data.kayntiosoite;
        if(data && data.osoite && data.postitoimipaikka) {
            return <OskariKartta osoite={data.osoite} postitoimipaikka={data.postitoimipaikka} />;
        }
        return null;
    }
    
    render(){
        const dropDownContent = this.state.viewContentState ? "expanded" : "collapsed";
        const isComponentCollapsing = this.state.isCollapsing ? "collapsing" : "";
        const tProp = this.props;
        return(
            <div className="row dropdown-component">
                <div className="col-12">
                    <div className={`col-12 slide-dropdown ${dropDownContent}`}>
                        <div className="slide-dropdown-header" onClick={this.toggleClass} onKeyPress={this.handleKeyPress} tabIndex="0" role="menu" aria-label={this.props.title} aria-live="assertive" aria-expanded={this.state.viewContentState ? true : false}>
                            <h2 className="d-flex justify-content-between">
                                <span className={"collapse-button icon-ic-block-" + dropDownContent}></span>
                                <span className="header-title">{this.props.title} {this.props.oppilaitos ? `(${this.props.oppilaitos.length})` : ""}</span>
                            </h2>
                        </div>    
                    </div> 
                    <div className={`dropdown-content ${dropDownContent} ${isComponentCollapsing}`}>
                        <div className="col-12" tabIndex="0">                  
                                {
                                    this.props.oppilaitos && 
                                    <div key={this.props.oid} className="col-12 box-container">
                                        {tProp.oppilaitos.map((t) => <OppilaitosListItem key={t.oid} toteutus={t} name={t} education={this.props.education} educationName={this.props.educationName ? this.props.educationName : null} />)}
                                    </div>
                                }
                                {
                                    this.props.text && 
                                    <div className="col-12">
                                        {this.props.teksti ? this.props.teksti : this.state.textContent()}                               
                                    </div>
                                }
                                {
                                    this.props.kuvaus && 
                                    <div className="col-11 text-block">
                                        <p>{this.props.teksti}</p>                          
                                    </div>
                                }
                                {
                                    this.props.osaamisalat && 
                                    <div className="col-12 box-container">
                                        {tProp.osaamisalatlist ? tProp.osaamisalatlist.map((t) => <OsaamisalaListItem key={l.localize(t.koodi.nimi)} osaamisala={t}/>): undefined}
                              
                                    </div>
                                }
                                {
                                    this.props.yhteystiedot &&
                                    <div>
                                        {this.luoKarttaJosOsoiteTiedossa()}
                                        <ContactInfoRow type="oppilaitos" data={this.props.data} name={this.props.name}/>
                                    </div>
                                }
                                {
                                    this.props.toteutus &&
                                    <div className="col-11 text-block">
                                        {renderHTML(this.props.content)}
                                    </div>
                                }
                                {
                                    this.props.valintakokeet && 
                                    <div className="col-12 box-container">
                                        {tProp.valintakokeetlist ? tProp.valintakokeetlist.map((t) => <ValintakokeetListItem key={l.localize(t.tyyppi.nimi)} valintakoe={t}/>): undefined}
                              
                                    </div>
                                }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SlideDropdown;