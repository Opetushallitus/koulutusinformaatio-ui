import {Component} from "react";
import React from "react";
import OppilaitosListItem from './OppilaitosListItem';
import { Localizer as l } from '../../tools/Utils';

class OppilaitosList extends Component {

    render () {
        const oppilaitokset = this.props.oppilaitokset.sort((o1, o2) => {
           return l.localize(o1.tarjoaja, "").localeCompare(l.localize(o2.tarjoaja, ""))
        });
        return (
            <div className="container search-results">
                <div key={this.props.oid} className="col-xs-12 col-md-6 box-container">
                    {oppilaitokset.map(t => <OppilaitosListItem toteutus={t}/>)}
                </div>
            </div>
        );
    }
}

export default OppilaitosList;