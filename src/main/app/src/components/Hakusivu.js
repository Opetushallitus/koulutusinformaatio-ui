import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki';
import Haku from './haku/Haku';
import Koulutus from './koulutus/Koulutus';
import Oppilaitos from './oppilaitos/Oppilaitos';
import Toteutus from './toteutus/Koulutus';
import Vertailu from './vertailu/Vertailu';
import { Route } from 'react-router-dom';

class Hakusivu extends Component {

    render() {
        return (
            <React.Fragment>
                <Hakupalkki/>
                <Route path={'/haku/:keyword?'} render={(props) => <Haku {...props}/>}/>
                <Route path={'/koulutus/:oid'} render={(props) => <Koulutus {...props} />}/>
                <Route path={'/oppilaitos/:oid'} render={(props) => <Oppilaitos {...props} />}/>
                <Route path={'/toteutus/:oid'} render={(props) => <Toteutus {...props} />}/>
                <Route path={'/vertailu'} render={(props) => <Vertailu {...props} />}/>
            </React.Fragment>
        );
    }
}

export default Hakusivu;