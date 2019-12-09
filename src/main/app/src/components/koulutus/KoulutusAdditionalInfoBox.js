import React, { Component } from 'react';
import '../../assets/styles/components/_koulutus-additional-info-box.scss';
import SlideDropdown from '../common/SlideDropdown';

class KoulutusAdditionalInfoBox extends Component {
  render() {
    return (
      <div>
        <h1 className="koulutus-additional-info-header">
          Lisätietoa koulutuksesta
        </h1>
        <div className="rectangle"></div>
        <div className="col-12" id="additional-info-box">
          <div className="koulutus-additional-info">
            <ul className="koulutus-additional-info-box" tabIndex="0">
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

export default KoulutusAdditionalInfoBox;
