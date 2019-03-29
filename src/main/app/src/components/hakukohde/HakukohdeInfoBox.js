import React, {Component} from 'react';
import {Localizer as l} from "../../tools/Utils";
import '../../assets/styles/components/_hakukohde-info-box.scss';

class HakukohdeInfoBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otsikkoLeft: props.fields.otsikkoLeft,
            fieldsLeft: props.fields.left,
        };
    }

    parseNimi() {
        if(this.props.nimi) {
            return l.localize(this.props.nimi, 'fi')
        }
        return ""
    }

    render () {
        if(!this.state.fieldsLeft) {
            return null;
        }
        
        return (
            <div id="hakukohde-info-box">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 box hakukohde">
                            {this.state.otsikkoLeft ? <h3>{this.parseNimi()}, PK</h3> : ""}
                            {this.state.fieldsLeft.map(row => row[1] && 
                                <div className="col-12" key={`${row[0]} ${row[1]}`}>
                                   <p>{`${row[0]} ${(row[0].length === 0 ? "" : ": ")} ${row[1]}`}</p>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HakukohdeInfoBox;