import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import '../../assets/styles/components/_slide-dropdown.scss';
import OppilaitosListItem from '../koulutus/OppilaitosListItem';
import OskariKartta from "../oppilaitos/OskariKartta";
import ContactInfoRow from '../common/ContactInfoRow';


class SlideDropdown extends Component{
    
    constructor(props) {
        super(props)
        this.toggleClass= this.toggleClass.bind(this);
        this.state = {
          viewContentState: false,
          isCollapsing: false,
          textContent: () => {
            return <div className="col-11 text-block"><p>Opintopolku-portaalia ylläpitää Opetushallitus. Suomalaiset oppilaitokset ja korkeakoulut ylläpitävät Opintopolussa omien koulutustensa tietoja. Opintopolku.fi-palvelussa voi:</p> <ul> <li>Selailla eri aloja ja tutkintoja</li> <li>Saada tietoa opinnoista</li> <li>Etsiä ajankohtaisia koulutuksia</li> <li>Tutustua valintaperusteisiin</li> <li>Hakea koulutuksiin</li> <li>Katsoa videoita ja lukea tarinoita opiskelijoiden omista kokemuksista.</li> </ul> <p>Opintopolku.fi -palvelu on sähköinen palvelukokonaisuus, josta löytyy kattavasti koulutuksen ja opetuksen järjestäjän palveluita. Palvelujen käyttäjiä ovat esimerkiksi koulutukseen hakeutujat, opiskelijat, oppilaitokset, yritykset sekä julkishallinto.</p> <p>Opintopolku.fi -palvelu tarjoaa kansalaiselle helppokäyttöisiä, luotettavia ja turvallisia palveluita elinikäisen ja yksilöllisen oppimispolun suunnitteluun ja toteuttamiseen.</p> <p>Opintopolku on kokonaisuudessaan sähköinen palvelukokonaisuus myös koulutuksen ja opetuksen järjestäjille.</p></div>;
          }
        }
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

    luoKarttaJosOsoiteTiedossa() {
        const data = this.props.data.kayntiosoite;
        if(data && data.osoite && data.postitoimipaikka) {
            return <OskariKartta osoite={data.osoite} postitoimipaikka={data.postitoimipaikka} />;
        }
        return null;
    }
    
    render(){
        const dropDownContent = this.state.viewContentState ? "expanded" : "collapsed";
        const isComponentCollapsing = this.state.isCollapsing ? "collapsing" : ""
        const tProp = this.props;
        return(
            <div className="row dropdown-component">
                <div className="col-12">
                    <div className={"col-12 slide-dropdown " + dropDownContent}>
                        <div className="slide-dropdown-header" onClick={this.toggleClass}>
                            <h2 className="d-flex justify-content-between">
                                <span className={"collapse-button icon-ic-block-" + dropDownContent}></span>
                                <span className="header-title">{this.props.title} {this.props.oppilaitos ? `(${this.props.oppilaitos.length})` : ""}</span>
                            </h2>
                        </div>    
                    </div> 
                    <div className={"dropdown-content " + dropDownContent + " " + isComponentCollapsing}>
                        <div className="col-12">                  
                                {
                                    this.props.oppilaitos && 
                                    <div key={this.props.oid} className="col-12 box-container">
                                        {tProp.oppilaitos.map((t) => <OppilaitosListItem key={t.oid} toteutus={t} name={t} education={this.props.education}/>)}
                                    </div>
                                }
                                {
                                    this.props.text && 
                                    <div className="col-12">
                                        {this.state.textContent()}                               
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SlideDropdown;