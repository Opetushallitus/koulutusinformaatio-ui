import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import '../../assets/styles/components/_koulutus.scss';
import Korkeakoulu from './Korkeakoulu';
import Ammatillinen from './Ammatillinen';
import Hakunavigaatio from './../hakutulos/Hakunavigaatio';
import Media from 'react-media';
import KoulutusHeaderImage from './KoulutusHeaderImage';
import PageVertailuBox from '../common/PageLikeBox';
import Avoin from './Avoin';
import Lukio from './Lukio';
import KoulutusHeader from './KoulutusHeader';

@inject('restStore')
@inject('navigaatioStore')
@observer
class Koulutus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      koulutus: undefined,
      selectedMenuItem: 0,
      menuElements: ['Koulutuksen esittely', 'Oppilaitokset'],
    };
    this.getSelectedItem = this.getSelectedItem.bind(this);
    this.setSelectedItem = this.setSelectedItem.bind(this);
    this.resetSelectedItem = this.resetSelectedItem.bind(this);
  }

  async componentDidMount() {
    await this.getKoulutus();
  }

  async componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    await this.getKoulutus();
  }

  getKoulutus() {
    this.props.navigaatioStore.setOid(this.props.match.params.oid);
    this.props.restStore.getKoulutus(this.props.navigaatioStore.oid, (k) => {
      this.setState({
        koulutus: k,
      });
    });
  }

  getSelectedItem(i) {
    this.setState({
      selectedMenuItem: i,
    });
  }

  setSelectedItem() {
    return this.state.selectedMenuItem;
  }

  resetSelectedItem() {
    this.setState({
      selectedMenuItem: 0,
    });
  }

  chooseKoulutus() {
    let selectedItem = this.setSelectedItem();
    if (this.state.koulutus && this.state.koulutus.koulutustyyppi) {
      switch (this.state.koulutus.koulutustyyppi) {
        case 'lk':
          return (
            <Lukio
              items={this.state.menuElements}
              selected={selectedItem}
              item={this.getSelectedItem}
              oid={this.props.navigaatioStore.oid}
              result={this.state.koulutus}
            />
          ); //TODO
        case 'yo':
          return (
            <Korkeakoulu
              items={this.state.menuElements}
              selected={selectedItem}
              item={this.getSelectedItem}
              oid={this.props.navigaatioStore.oid}
              result={this.state.koulutus}
            />
          );
        case 'kk':
          return (
            <Korkeakoulu
              items={this.state.menuElements}
              selected={selectedItem}
              item={this.getSelectedItem}
              oid={this.props.navigaatioStore.oid}
              result={this.state.koulutus}
            />
          );
        case 'amk':
          return (
            <Korkeakoulu
              items={this.state.menuElements}
              selected={selectedItem}
              item={this.getSelectedItem}
              oid={this.props.navigaatioStore.oid}
              result={this.state.koulutus}
            />
          );
        case 'ako':
          return (
            <Avoin
              items={this.state.menuElements}
              selected={selectedItem}
              item={this.getSelectedItem}
              oid={this.props.navigaatioStore.oid}
              result={this.state.koulutus}
            />
          );
        case 'amm':
          return (
            <Ammatillinen
              items={this.state.menuElements}
              selected={selectedItem}
              item={this.getSelectedItem}
              oid={this.props.navigaatioStore.oid}
              result={this.state.koulutus}
            />
          );
        default:
          return (
            <Ammatillinen
              items={this.state.menuElements}
              selected={selectedItem}
              item={this.getSelectedItem}
              oid={this.props.navigaatioStore.oid}
              result={this.state.koulutus}
              muu={true}
            />
          );
      }
    }
    return <div />;
  }

  koulutusType() {
    if (this.state.koulutus) {
      return this.state.koulutus.koulutustyyppi;
    }
  }

  koulutusNimi() {
    if (this.state.koulutus) {
      return this.state.koulutus.nimi;
    }
  }

  render() {
    const selectedKoulutus = this.chooseKoulutus();
    const actualKoulutus = this.koulutusType();
    const koulutusNimi = this.koulutusNimi();
    const hattu = actualKoulutus !== 'amm' ? 'muu-hattu' : 'ammatillinen-hattu';
    return (
      <React.Fragment>
        <div className="container" id="koulutus-container">
          <div className="row">
            <Media query="(min-width: 992px)">
              {/* 
                                    matches => matches ? (
                                        <KoulutusSidebar items={this.state.menuElements} type={actualKoulutus} selected={selectedItem} item={this.getSelectedItem}></KoulutusSidebar>
                                    ): null*/}
            </Media>
            <div className="col-12 col-md-12 col-lg-12 col-xl-12">
              <KoulutusHeader hattu={hattu} nimi={koulutusNimi} />
              <Media query="(min-width: 992px)">
                {(matches) =>
                  matches ? (
                    <PageVertailuBox text="Lisää vertailuun"></PageVertailuBox>
                  ) : null
                }
              </Media>
              <div className="header-image">
                <KoulutusHeaderImage></KoulutusHeaderImage>
              </div>
              {selectedKoulutus}
            </div>
          </div>
        </div>
        <Hakunavigaatio />
      </React.Fragment>
    );
  }
}

export default Koulutus;
