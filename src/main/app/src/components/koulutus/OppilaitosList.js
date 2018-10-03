import {Component} from "react";
import React from "react";
import OppilaitosListItem from './OppilaitosListItem';
import { Localizer as l } from '../../tools/Utils';
import {translate} from 'react-i18next';

@translate()
class OppilaitosList extends Component {

    render () {
        const {t} = this.props;
        const oppilaitokset = this.props.oppilaitokset.sort((o1, o2) => {
           return l.localize(o1.tarjoaja, "").localeCompare(l.localize(o2.tarjoaja, ""))
        });
        var oppilaitosList = <div/>;
        if(oppilaitokset.length > 0) {
            oppilaitosList = <div className="col-12 left-column">
                <h2 className="line_otsikko">{t('koulutus.oppilaitokset')}</h2>
                <div className="container search-results">
                    <div key={this.props.oid} className="col-12 col-md-6 box-container">
                        {oppilaitokset.map(t => <OppilaitosListItem key={t.oid} toteutus={t}/>)}
                    </div>
                </div>
            </div>;
        };
        return (
            <React.Fragment>
            {oppilaitosList}
            </React.Fragment>
        );
    }
}

export default OppilaitosList;