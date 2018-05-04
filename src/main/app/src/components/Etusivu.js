import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki'

class Etusivu extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Hakupalkki main={true}/>
        );
    }
}

export default Etusivu;