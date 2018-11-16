import {Component} from "react";
import React from "react";
import SlideDropdown from '../common/SlideDropdown';
import { Localizer as l } from '../../tools/Utils';
import {translate} from 'react-i18next';

@translate()
class OppilaitosList extends Component {

    render () {
        const {t} = this.props;
        const oppilaitokset = this.props.oppilaitokset.sort((o1, o2) => {
           return l.localize(o1.tarjoaja, "").localeCompare(l.localize(o2.tarjoaja, ""))
        });
        const educationTitle = this.props.nimi || false;
        return (
    
            <React.Fragment>            
                <SlideDropdown 
                    title={t('koulutus.oppilaitokset')}
                    oppilaitos={oppilaitokset.length > 0 ? oppilaitokset : false}
                    education={educationTitle} 
                />                      
            </React.Fragment>
        );
    }
}

export default OppilaitosList;