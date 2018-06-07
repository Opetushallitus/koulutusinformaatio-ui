import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki'
import Haku from './haku/Haku'
import Koulutus from './koulutus/Koulutus'
import Oppilaitos from './oppilaitos/Oppilaitos'
import { Route } from 'react-router-dom'

class Etusivu extends Component {

    render() {
        return (
            <React.Fragment>
                <Hakupalkki/>
                <Route path='/haku/:keyword?' render={(props) => <Haku {...this.props}/>}/>
                <Route path={'/koulutus/:oid'} render={(props) => <Koulutus {...props} />}/>
                <Route path={'/oppilaitos/:oid'} render={(props) => <Oppilaitos {...props} />}/>
            </React.Fragment>

        );
    }
}

export default Etusivu;