import React, {Component, Fragment} from 'react';

class OppilaitoksetBox extends Component {

    render () {
        return (
            <Fragment>
                <h2 className="line_otsikko">Oppilaitokset ({this.props.oppilaitokset.length})</h2>
                <div className="box-container">
                    <div className="col-xs-12 oppilaitos-box">
                        <h3>Oppilaitoksen nimi</h3>
                        <div className="text">
                            <p>erikoistumisalat</p>
                        </div>
                    </div>
                </div>
            </Fragment>
        ); //TODO: Hae oppilaitoksien tiedot
    }
}

export default OppilaitoksetBox;