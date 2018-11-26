import React, {Component} from 'react';

class OppilaitosKoulutukset extends Component{

    render(){
            
        return(
            <div className="col-12" id="koulutukset-filter">
                <p>{this.props.oid}</p>
            </div>
        )
    }
}

export default OppilaitosKoulutukset;