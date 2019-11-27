import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import KoulutusSection from './KoulutusSection';
import { Localizer as l } from '../../tools/Utils';
import { withTranslation } from 'react-i18next';
import Media from 'react-media';
import SideBarMenu from '../common/SideBarMenu';
import OppilaitosList from './OppilaitosList';
import KoulutusHeader from './KoulutusHeader';
import SlideDropDown from '../common/SlideDropdown';

class Lukio extends Component {
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  parseInfoBoxFields() {
    const { t } = this.props;
    const fields = [];
    // alku, kieli, laajuus, kesto, muoto, pohja
    const aloitusPvm = this.props.result.koulutuksenAlkamisPvms
      ? new Date(Number(this.props.result.koulutuksenAlkamisPvms[0]))
      : undefined;
    const koulutusAlkaa = aloitusPvm
      ? aloitusPvm.getDate() +
        '.' +
        (aloitusPvm.getMonth() + 1) +
        '.' +
        aloitusPvm.getFullYear()
      : undefined;
    fields.push([t('koulutus.alkaa'), koulutusAlkaa]);

    this.props.result.opetuskielis
      ? fields.push([
          t('koulutus.opetuskieli'),
          l.localize(this.props.result.opetuskielis[0]),
        ])
      : fields.push([t('koulutus.opetuskieli'), undefined]);

    const opintojenLaajuusarvo = l.localize(
      this.props.result.opintojenLaajuusarvo,
      '-'
    );
    const opintojenLaajuusyksikko = l.localize(
      this.props.result.opintojenLaajuusyksikko
    );
    fields.push([
      t('koulutus.laajuus'),
      opintojenLaajuusarvo &&
        opintojenLaajuusarvo + ' ' + opintojenLaajuusyksikko,
    ]);

    const suunniteltuKesto = this.props.result.suunniteltuKestoArvo;
    const suunniteltuKestoTyyppi = l.localize(
      this.props.result.suunniteltuKestoTyyppi
    );
    fields.push([
      t('koulutus.kesto'),
      suunniteltuKesto + ' ' + suunniteltuKestoTyyppi,
    ]);

    fields.push([
      t('koulutus.opiskelumuoto'),
      this.props.result.opetusmuodos
        ? this.props.result.opetusmuodos.map((t) => l.localize(t) + ' ')
        : undefined,
    ]);
    fields.push([
      t('koulutus.pohjakoulutus'),
      l.localize(this.props.result.pohjakoulutusvaatimus),
    ]);

    return fields;
  }

  render() {
    const jatkoOpinnot = l.localize(
      this.props.result.kuvausKomo.JATKOOPINTO_MAHDOLLISUUDET,
      undefined
    );
    const koulutuksenSisalto = l.localize(
      this.props.result.kuvausKomo.TAVOITTEET,
      undefined
    );
    const { t } = this.props;
    return (
      <React.Fragment>
        <KoulutusHeader
          hattu="lukio-hattu"
          nimi={this.props.result.searchData.nimi}
        />
        <Media query="(max-width: 992px)">
          {(matches) =>
            matches ? (
              <SideBarMenu items={this.props.items} item={this.props.item} />
            ) : null
          }
        </Media>
        <KoulutusInfoBox fields={this.parseInfoBoxFields()} />
        {koulutuksenSisalto && (
          <SlideDropDown
            title={t('oulutus.pääaineet')}
            toteutus={true}
            content={koulutuksenSisalto}
          />
        )}
        <KoulutusSection
          content={koulutuksenSisalto}
          header="koulutus.sisältö"
        />
        {jatkoOpinnot && (
          <SlideDropDown
            title={t('koulutus.jatko-opinnot')}
            toteutus={true}
            content={jatkoOpinnot}
          />
        )}
        <OppilaitosList
          oid={this.props.oid}
          oppilaitokset={this.props.result.toteutukset}
          nimi={this.props.result.searchData.nimi}
        />
      </React.Fragment>
    );
  }
}

export default withTranslation()(Lukio);
