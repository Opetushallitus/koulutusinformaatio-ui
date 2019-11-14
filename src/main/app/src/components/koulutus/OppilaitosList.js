import {Component} from "react";
import React from "react";
import { Localizer as l } from '../../tools/Utils';
import {withTranslation} from 'react-i18next';
import '../../assets/styles/components/_oppilaitos-list.scss';
import OppilaitosListItem from './OppilaitosListItem';
import {withRouter} from "react-router-dom";

class OppilaitosList extends Component {

    render () {
        const oppilaitokset = this.props.oppilaitokset.sort((o1, o2) => {
           return l.localize(o1.tarjoaja, "").localeCompare(l.localize(o2.tarjoaja, ""))
        });
        const tProp = this.props;
        return (
    
            <React.Fragment>
            <div>
                <h1 className="oppilaitos-info-header">Koulutusta järjestävät oppilaitokset</h1>
                <div className="rectangle"></div>
                    {oppilaitokset && <div key={this.props.oid} className="col-12 box-container">
                        {oppilaitokset.map((t) => <OppilaitosListItem koulutusUri={tProp.koulutus} key={t.oid} toteutus={t} name={t} education={this.props.education} educationName={this.props.educationName ? this.props.educationName : null} />)}
                    </div>}
            </div>                        
            </React.Fragment>
        );
    }
}

export default withTranslation()(OppilaitosList);