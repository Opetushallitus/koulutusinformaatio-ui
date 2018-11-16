import React, {Component} from 'react';

class KoulutusInfoBox extends Component {

    render () {
        return (
          <div className="col-12" id="info-box">
                <div className="koulutusinfo">
                    <ul className="koulutusinfolaatikko">
                        {this.props.fields.map(row => row[1] && <li key={row[0]}><span>{`${row[0]}:  ${row[1]}`}</span></li>)}
                    </ul>
                </div>
          </div>
        );
    }
}

export default KoulutusInfoBox;