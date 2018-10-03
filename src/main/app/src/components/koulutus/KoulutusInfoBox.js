import React, {Component} from 'react';

class KoulutusInfoBox extends Component {

    render () {
        return (
          <div className="row">
                <div className="col-12 left-column">
                  <div className="koulutusinfo">
                      <ul className="koulutusinfolaatikko">
                          {this.props.fields.map(row => row[1] && <li key={row[0]}>{row[0] + ": " + row[1]}</li>)}
                      </ul>
                  </div>
                </div>
          </div>
        );
    }
}

export default KoulutusInfoBox;