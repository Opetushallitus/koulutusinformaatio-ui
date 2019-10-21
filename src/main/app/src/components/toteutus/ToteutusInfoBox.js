import React, {Component} from 'react';
import '../../assets/styles/components/_toteutus-info-box.scss';
import '../../assets/styles/_material-icons.css';

class ToteutusInfoBox extends Component {

    render () {
        return (
        <div>
            <h1 className="toteutus-info-header">Koulutuksen perustiedot</h1>
            <div className="rectangle"></div>
            <div className="col-12" id="toteutus-information-box">
                    <div className="toteutus-info">
                        <ul className="toteutus-info-box" tabIndex="0">
                            {this.props.fields.map(row => row[1] && <div className="toteutus-info-box-item" key={row[0]}><li><span><i className="material-icons">{row[2]}</i>{`${row[0]}: `}</span></li><li><span>{`${row[1]}`}</span></li></div>)}
                        </ul>
                    </div>
            </div>
        </div>
        );
    }
}

export default ToteutusInfoBox;