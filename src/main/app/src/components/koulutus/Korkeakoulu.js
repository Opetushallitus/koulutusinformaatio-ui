import React, { Component } from 'react';
import KoulutusInfoBox from './KoulutusInfoBox';
import { Localizer as l } from '../../tools/Utils';
import { withTranslation } from 'react-i18next';
import OppilaitosList from './OppilaitosList';
import KoulutusHeader from './KoulutusHeader';
import SlideDropDown from '../common/SlideDropdown';
import Media from 'react-media';
import SideBarMenu from '../common/SideBarMenu';

class Korkeakoulu extends Component {
  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  parseInfoBoxFields() {
    const { t } = this.props;
    const fields = [];
    // laajuus, kesto, maksullinen, tutkintonimike

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
      t('koulutus.maksullinen'),
      this.props.result.opintojenMaksullisuus ? t('kyllä') : t('ei'),
    ]);
    fields.push([
      t('koulutus.tutkintonimikkeet'),
      this.props.result.tutkintonimikes
        ? this.props.result.tutkintonimikes.map((t) => l.localize(t) + ' ')
        : '-',
    ]);

    return fields;
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <KoulutusHeader
          hattu="korkeakoulu-hattu"
          nimi={this.props.result.metadata.nimi}
        />
        <Media query="(max-width: 992px)">
          {(matches) =>
            matches ? (
              <SideBarMenu items={this.props.items} item={this.props.item} />
            ) : null
          }
        </Media>
        <KoulutusInfoBox fields={this.parseInfoBoxFields()} />
        <SlideDropDown text={true} title={t('koulutus.kuvaus')} />
        <OppilaitosList
          oid={this.props.oid}
          oppilaitokset={this.props.result.toteutukset}
          educationName={this.props.result.nimi}
        />
      </React.Fragment>
    );
  }
}

export default withTranslation()(Korkeakoulu);
