import React, {Component} from 'react';
import '../../assets/styles/components/_services-menu.scss';

class ServicesMenu extends Component{
    
    constructor(props) {
        super(props)
        this.closeMenu= this.closeMenu.bind(this);
        this.state = {
          componentState: false,
          closing: false
        }
    }

    closeMenu() {
        this.setState({
            closing: true
        });      
        setTimeout(() => {
          this.props.unmountMe();          
        }, 250);
    }

    render(){
        const isClosing = !!this.state.closing ? "closing" : "open";
        return(
            <React.Fragment>
                <div className={"overlay displayed-" + !this.state.closing} onClick={this.closeMenu}></div>
                <div className={"services-menu " + isClosing }>
                <a className="menu-close" onClick={this.closeMenu}><i className="icon-outline-close"/></a>
                    <ul>
                        <li className="omat">
                            <a href="/">
                                <p>Omat opintosuoritukseni</p>
                                <p className="small">Palvelun ansiosta kansalaiset ja viranomaiset saavat tarvitsemansa koulutustiedot luotettavasti yhdestä paikasta.</p>
                            </a>    
                        </li>
                        <li className="hakemus">
                            <a href="/">
                                <p>Hakemuspalvelu</p>
                                <p className="small"> Hakemuspalvelu on osa ns. Virkailijan Opintopolun palvelukokonaisuutta.
                                    Käyttäjätunnuksen saat Opetushallitukselta.</p>
                            </a>  
                        </li>
                        <li className="ehoks">
                            <a href="/">
                                <p>eHoks</p>
                                <p className="small">Tukea opiskelijan henkilökohtaisen osaamisen kehittämissuunnitelman 
                                    laadintaa sekä parantaa tiedon näkyvyyttä ja liikkuvuutta eri toimijoiden välillä</p>
                            </a>  
                        </li>
                        <li className="eperusteet">
                            <a href="/">
                                <p>ePerusteet</p>
                                <p className="small">ePerusteet-palvelussa voit tutustua voimassa oleviin opetussuunnitelmien ja tutkintojen perusteisiin. Perusteita julkaistaan palvelussa vaiheittain.</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        
        )
    }
}

export default ServicesMenu;