import React, { Component } from 'react';
import HakuNavigaatio from './HakuNavigaatio';

class Koulutus extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            oid: props.location.state.oid
        };
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <h1>Koulutus: {this.state.oid}</h1>
                </div>
                <HakuNavigaatio/>
            </React.Fragment>
        );
    }
}

export default Koulutus;