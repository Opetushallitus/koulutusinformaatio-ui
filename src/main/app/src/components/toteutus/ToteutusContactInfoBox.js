import React, { Component } from 'react';
import '../../assets/styles/components/_toteutus-additional-info-box.scss';

class ToteutusContactInfoBox extends Component {
  render() {
    return (
      <div>
        <h1 className="toteutus-additional-info-header">
          Koulutuksen yhteyshenkilö
        </h1>
        <div className="rectangle"></div>
        <div className="col-12" id="contact-info-box">
          <div className="contact-info-wrapper">
            <ul className="contact-additional-info-box" tabIndex="0">
              -
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ToteutusContactInfoBox;
