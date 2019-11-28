import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import '../../assets/styles/components/_hakukohde-koulutus.scss';
import Korkeakoulu from './Korkeakoulu';
import Ammatillinen from './Ammatillinen';
import Hakunavigaatio from './../hakutulos/Hakunavigaatio';
import Avoin from './Avoin';
import Lukio from './Lukio';

@inject('restStore')
@inject('navigaatioStore')
@observer
class Koulutus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hakukohde: undefined,
      haku: undefined,
    };
  }

  async componentDidMount() {
    await this.getHakukohde();
  }

  async componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    await this.getHakukohde();
  }

  getHakukohde() {
    this.props.navigaatioStore.setOid(this.props.match.params.oid);
    this.props.restStore.getHakukohde(this.props.navigaatioStore.oid, (k) => {
      this.setState({
        hakukohde: k,
      });
      this.getHaku(k.hakuOid);
    });
  }

  getHaku(oid) {
    this.props.restStore.getHaku(oid, (h) => {
      this.setState({
        haku: h,
      });
    });
  }

  chooseKoulutus() {
    if (this.state.hakukohde && this.state.haku) {
      switch (this.state.hakukohde) {
        case 'lk':
          return (
            <Lukio
              organisaatio={this.state.organisaatio}
              koulutus={this.state.koulutus}
              educationType={
                this.state.koulutus && this.state.koulutus.metadata.tyyppi
              }
              oid={this.props.navigaatioStore.oid}
            />
          ); //TODO
        case 'kk':
          return (
            <Korkeakoulu
              organisaatio={this.state.organisaatio}
              koulutus={this.state.koulutus}
              educationType={
                this.state.koulutus && this.state.koulutus.metadata.tyyppi
              }
              oid={this.props.navigaatioStore.oid}
            />
          );
        case 'ako':
          return (
            <Avoin
              organisaatio={this.state.organisaatio}
              koulutus={this.state.koulutus}
              educationType={
                this.state.koulutus && this.state.koulutus.metadata.tyyppi
              }
              oid={this.props.navigaatioStore.oid}
            />
          );
        case 'amm':
          return (
            <Ammatillinen
              organisaatio={this.state.organisaatio}
              koulutus={this.state.koulutus}
              educationType={
                this.state.koulutus && this.state.koulutus.metadata.tyyppi
              }
              oid={this.props.navigaatioStore.oid}
            />
          );
        default:
          return (
            <Ammatillinen
              hakukohde={this.state.hakukohde}
              haku={this.state.haku}
              oid={this.props.navigaatioStore.oid}
              muu={true}
            />
          );
      }
    }
    return <div />;
  }

  render() {
    const selectedKoulutus = this.chooseKoulutus();
    return (
      <React.Fragment>
        <div className="container" id="hakukohde-container">
          <div className="row info-page hakukohde">{selectedKoulutus}</div>
        </div>
        <Hakunavigaatio />
      </React.Fragment>
    );
  }
}

export default Koulutus;
