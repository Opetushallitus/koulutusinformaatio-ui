import React, {Component} from 'react';
import CheckBox from '../common/CheckBox';
import ActionButton from '../common/ActionButton';
import '../../assets/styles/components/_koulutukset-filter.scss';

class KoulutuksetFilter extends Component{

    render(){
        const filtersName = [
            "Johtamiskorkeakoulu", 
            "Kasvatustiede", 
            "Luonnontiede", 
            "Lääketiede ja biotieteet", 
            "Viestintätiede", 
            "Yhteiskuntatiede"];
            
        return(
            <div className="col-12 col-lg-11 col-xl-12 col-xxxl-9" id="koulutukset-filter">
            <div className="row">
                    <div className="form-group">
                        <h4>Rajaa koulutuksia</h4>
                        <h5>Valitse tiedekunta</h5>
                        {
                            filtersName.map((filter,i) => <CheckBox filterName={filter} key={i} />)
                        }
                    </div>
                    <hr/>
                    <div className="form-group">
                        <h5>Haku käynnissä</h5>
                        <ActionButton type="switch"/>
                    </div>
                    <hr/>
                    <div className="form-group d-flex justify-content-around flex-column">
                        <ActionButton type="transparent" text="Rajaa koulutuksia" className="align-self-center"/>
                        <a className="clear-filters align-self-center" href="/">Poista rajaukset</a>
                    </div>
            </div>
                    
            </div>
        )
    }
}

export default KoulutuksetFilter;