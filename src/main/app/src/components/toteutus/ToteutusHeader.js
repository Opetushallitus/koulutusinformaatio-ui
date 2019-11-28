import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Localizer as l } from '../../tools/Utils';
import { inject } from 'mobx-react';
import '../../assets/styles/components/_toteutus-header.scss';

@inject('hakuStore')
class ToteutusHeader extends Component {
  parseNimi() {
    if (this.props.nimi) {
      return l.localize(
        this.props.nimi,
        this.props.t('koulutus.tuntematon'),
        'fi'
      );
    }
    return '';
  }

  render() {
    return (
      <div className="row" id="toteutus-header">
        <div className="col-12">
          <h1 className="d-flex justify-content-between">
            <span className="title toteutus-header-title">
              {this.parseNimi()}
            </span>
          </h1>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ToteutusHeader);
