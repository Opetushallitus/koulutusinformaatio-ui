import React from 'react';

import { SchoolOutlined, ExtensionOutlined, TimelapseOutlined } from '@material-ui/icons';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { educationTypeColorCode } from '#/src/colors';
import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { KoulutusKorttiLogo } from '#/src/components/common/KorttiLogo';
import { localize } from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

type Props = {
  koulutus: {
    oid: string;
    kuvaus: Translateable;
    koulutustyyppi: keyof typeof educationTypeColorCode;
    tutkintonimikkeet: Array<Translateable>;
    teemakuva?: string;
  };
};

export const KoulutusKortti = ({ koulutus }: Props) => {
  const { t } = useTranslation();

  const kuvaus =
    _.truncate(
      localize(koulutus?.kuvaus)
        .replace(/<\/li>/gm, ',</li>')
        .replace(/\.,<\/li>/gm, '.</li>')
        .replace(/<[^>]*>/gm, ''),
      { length: 255 }
    ) || t('haku.ei_kuvausta');
  const isOsaamisalaOrTutkinnonOsa = _.includes(
    ['amm-osaamisala', 'amm-tutkinnon-osa'],
    koulutus?.koulutustyyppi
  );
  const tutkintoNimikkeet = isOsaamisalaOrTutkinnonOsa
    ? t(`haku.${koulutus?.koulutustyyppi}`)
    : (koulutus?.tutkintonimikkeet || []).map(localize).join(', ').replace(/,\s*$/, '') ||
      t('haku.ei-tutkintonimiketta');
  const logoAltText = `${localize(koulutus)} ${t('koulutus.koulutuksen-teemakuva')}`;

  return (
    <EntiteettiKortti
      koulutustyyppi={koulutus?.koulutustyyppi}
      to={`/koulutus/${koulutus?.oid}`}
      header={localize(koulutus)}
      kuvaus={kuvaus}
      iconTexts={[
        [
          tutkintoNimikkeet,
          isOsaamisalaOrTutkinnonOsa ? ExtensionOutlined : SchoolOutlined,
        ],
        [getLocalizedOpintojenLaajuus(koulutus), TimelapseOutlined],
      ]}>
      <KoulutusKorttiLogo image={koulutus?.teemakuva} alt={logoAltText} />
    </EntiteettiKortti>
  );
};
