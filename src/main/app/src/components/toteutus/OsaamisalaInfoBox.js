import React, { Component } from 'react';
import '../../assets/styles/components/_toteutus-additional-info-box.scss';
import SlideDropdown from '../common/SlideDropdown';
import { Localizer as l } from '../../tools/Utils';

class OsaamisalaInfoBox extends Component {
  render() {
    return (
      <div>
        <h1 className="toteutus-additional-info-header">Osaamisalat</h1>
        <div className="rectangle"></div>
        <div className="col-12" id="toteutus-osaamisala-info-box">
          <div className="toteutus-additional-info">
            <ul className="toteutus-additional-info-box" tabIndex="0">
              {this.props.fields.map((t) => (
                <SlideDropdown
                  title={l.localize(t.koodi.nimi)}
                  key={l.localize(t.koodi.nimi)}
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

export default OsaamisalaInfoBox;
