import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import '../../assets/styles/components/_koulutus-description-box.scss';

class KoulutusInfoBox extends Component {
  render() {
    return (
      <div>
        <h1 className="koulutus-description-header">Koulutuksen kuvaus</h1>
        <div className="rectangle"></div>
        <div className="col-12" id="description-box">
          <span className="description-box-content">
            {renderHTML(this.props.content)}
          </span>
        </div>
      </div>
    );
  }
}

export default KoulutusInfoBox;
