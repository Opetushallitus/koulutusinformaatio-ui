import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki';
import Haku from './haku/Haku';
import Sivu from './sivu/Sivu';
import Koulutus from './koulutus/Koulutus';
import Oppilaitos from './oppilaitos/Oppilaitos';
import Toteutus from './toteutus/Koulutus';
import Valintaperusteet from './valintaperusteet/index'
import Vertailu from './vertailu/Vertailu';
import Hakukohde from './hakukohde/Koulutus'
import { Route } from 'react-router-dom';
import '../assets/styles/components/_hakusivu.scss';

class Hakusivu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFilterDisplayed: false
        };
        this.moveMainContent = this.moveMainContent.bind(this);
    }

    moveMainContent() {
        this.setState({
            isFilterDisplayed: !this.state.isFilterDisplayed            
        })
    }

    onComponentUpdate(){
        if (document.getElementsByTagName("h1")[0]){
            document.getElementsByTagName("h1")[0].setAttribute("tabIndex",0);
            document.getElementsByTagName("h1")[0].focus();
            return;
        } else if (document.getElementsByTagName("h2")[0]){
            document.getElementsByTagName("h2")[0].setAttribute("tabIndex",0);
            document.getElementsByTagName("h2")[0].focus(); 
            return;
        }
    }

    render() {        
        let moveMainContent =  this.state.isFilterDisplayed; 
        return (
            <React.Fragment>
                <div id="call-to-action-secondary">
                    <div className="col-12">
                        <div className="header-search header-search--secondary">
                            <Hakupalkki isRajainVisible={this.moveMainContent}/>
                        </div>
                    </div>
                </div>
                <main id="main-content" className={moveMainContent ? "move-right" : "center-content"}>
                    <Route path={'/haku/:keyword?'} render={(props) => <Haku {...props} isComponentUpdated={this.onComponentUpdate}/>}/>
                    <Route path={'/koulutus/:oid'} render={(props) => <Koulutus {...props} />}/>
                    <Route path={'/oppilaitos/:oid'} render={(props) => <Oppilaitos {...props} />}/>
                    <Route path={'/toteutus/:oid'} render={(props) => <Toteutus {...props} />}/>
                    <Route path={'/hakukohde/:oid'} render={(props) => <Hakukohde {...props} />}/>
                    <Route path={'/vertailu'} render={(props) => <Vertailu {...props} />}/>
                    <Route path={'/sivu/:id'} render={(props) => <Sivu {...props} />}/>
                    <Route path={'/valintaperusteet/:oid'} render={(props) => <Valintaperusteet {...props} />}/>
                </main>
            </React.Fragment>
        );
    }
}

export default Hakusivu;