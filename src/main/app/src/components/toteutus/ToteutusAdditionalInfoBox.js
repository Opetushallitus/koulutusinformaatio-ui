import React, { Component } from 'react';
import '../../assets/styles/components/_toteutus-additional-info-box.scss';
import SlideDropdown from '../common/SlideDropdown';

class ToteutusAdditionalInfoBox extends Component {
  render() {
    return (
      <div>
        <h1 className="toteutus-additional-info-header">
          Lisätietoa koulutuksesta
        </h1>
        <div className="rectangle"></div>
        <div className="col-12" id="toteutus-additional-information-box">
          <div className="toteutus-additional-info">
            <ul className="toteutus-additional-info-box" tabIndex="0">
              {this.props.fields.map((t) => (
                <SlideDropdown
                  title={t.title}
                  key={t.title}
                  KoulutusAdditionalInfoClass={true}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ToteutusAdditionalInfoBox;
