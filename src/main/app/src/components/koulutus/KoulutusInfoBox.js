import React, {Component} from 'react';
import '../../assets/styles/components/_koulutus-info-box.scss';

class KoulutusInfoBox extends Component {

    render () {
        return (
        <div>
            <h1 className="koulutus-info-header">Koulutuksen perustiedot</h1>
            <div className="rectangle"></div>
            <div className="col-12" id="info-box">
                    <div className="koulutusinfo">
                        <ul className="koulutusinfolaatikko" tabIndex="0">
                        {this.props.fields.map(row => row[1] && <div className="koulutusinfolaatikko-item" key={row[0]}><li><span><i className="material-icons">{row[2]}</i>{`${row[0]}: `}</span></li><li><span>{`${row[1]}`}</span></li></div>)}
                        </ul>
                    </div>
            </div>
        </div>
        );
    }
}

export default KoulutusInfoBox;