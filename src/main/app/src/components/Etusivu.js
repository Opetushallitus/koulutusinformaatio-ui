import React, { Component } from 'react';
import Hakupalkki from './haku/Hakupalkki'

class Etusivu extends Component {

    render() {
        return (
            <Hakupalkki main={true}/>
        );
    }
}

export default Etusivu;