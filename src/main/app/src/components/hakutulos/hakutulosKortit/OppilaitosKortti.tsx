import React from 'react';

import { SchoolOutlined, PublicOutlined } from '@material-ui/icons';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { EntiteettiKortti } from '#/src/components/common/EntiteettiKortti';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { localize } from '#/src/tools/localization';
import { Koodi, Translateable } from '#/src/types/common';

type Props = {
  oppilaitos: {
    koulutusohjelmia: number;
    kuvaus?: Translateable;
    logo?: string;
    oid: string;
    nimi: Translateable;
    paikkakunnat: Array<Koodi>;
  };
};

export const OppilaitosKortti = ({ oppilaitos }: Props) => {
  const { t } = useTranslation();

  const paikkakunnatStr = (oppilaitos?.paikkakunnat || []).map(localize).join(', ');

  const kuvaus =
    _.truncate(localize(oppilaitos?.kuvaus).replace(/<[^>]*>/gm, ''), {
      length: 255,
    }) || t('haku.ei_kuvausta');

  const koulutusOhjelmatStr = `${oppilaitos?.koulutusohjelmia || 0} ${t(
    'haku.tutkintoon-johtavaa-koulutusta'
  )}`;
  const logoAltText = `${localize(oppilaitos)} ${t('haku.oppilaitoksen-logo')}`;

  return (
    <EntiteettiKortti
      to={`/oppilaitos/${oppilaitos?.oid}`}
      logoElement={<OppilaitosKorttiLogo image={oppilaitos?.logo} alt={logoAltText} />}
      header={localize(oppilaitos)}
      kuvaus={kuvaus}
      wrapDirection="column-reverse"
      iconTexts={[
        [koulutusOhjelmatStr, SchoolOutlined],
        [paikkakunnatStr, PublicOutlined],
      ]}
    />
  );
};
