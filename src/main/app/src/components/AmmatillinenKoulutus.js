import React from 'react';
import Box from '@material-ui/core/Box';
import { observer } from 'mobx-react-lite';
import KoulutusAsteIcon from '../assets/images/koulutusaste.svg';
import KoulutusTyypitIcon from '../assets/images/koulutustyyppi.svg';
import TutkintoNimikeIcon from '../assets/images/tutkintonimike.svg';
import SuunniteltuKestoIcon from '../assets/images/suunniteltu_kesto.svg';
import KoulutuksenLaajuusIcon from '../assets/images/koulutuksen_laajuus.svg';
import TutkintoonHakeminenIcon from '../assets/images/tutkintoon_hakeminen.svg';
import OpetusKasvatusPsykologiaIcon from '../assets/images/opetus_kasvatus_psykologia.svg';
import InfoGrid from './common/InfoGrid';
import { Typography } from '@material-ui/core';
import Markdown from 'markdown-to-jsx';
import { useStores } from '../hooks';
import InfoCardGrid from './common/InfoCardGrid';
import Tree from './common/Tree';

const infoGridData = {
  id: 'placeholder',
  text: `
Ammatillisia tutkintoja ovat ammatilliset perustutkinnot, ammattitutkinnot ja erikoisammattitutkinnot.  Ammatillisissa opilaitoksissa voi opiskella myös erilaisia tutkintoon johtamattomia opintokokonaisuuksia.

Ammatilliseen koulutukseen voi hakea ympäri vuoden jatkuvan haun kautta. Jos haet ammatilliseen perustutkintokoulutukseen peruskoulusta tai lukiosta, niin haet pääasiassa yhteishaun kautta. Ammattitutkintoihin ja erikoisammattitutkintoihin haet aina jatkuvan haun kautta.
  
Voit suorittaa perus-, ammatti- tai erikoisammattitutkintoja tai tutkinnon osia myös työvoimakoulutuksena. Ammatillinen työvoimakoulutus on tarkoitettu ensisijaisesti työttömille tai työttömyysuhan alaisille aikuisille, jotka ovat suorittaneet oppivelvollisuutensa. Opiskelijaksi ottamisessa käytetään työ- ja elinkeinopalvelun työvoimapoliittinen harkinta.`,
  infoGrid: [
    {
      icon: KoulutusAsteIcon,
      title: 'Koulutusaste:',
      text: 'Toinen aste',
    },
    {
      icon: KoulutusTyypitIcon,
      title: 'Koulutustyypit:',
      text:
        'Ammatilliset tutkinnot Täydennyskoulutukset Valmentava koulutus Avoimet opinnot',
    },
    {
      icon: TutkintoNimikeIcon,
      title: 'Tutkintotasot:',
      text: 'Perustutkinto Ammattitutkinto Erikoistammattitutkinto',
    },
    {
      icon: SuunniteltuKestoIcon,
      title: 'Suunniteltu kesto:',
      text: '1-3 vuotta',
    },
    {
      icon: KoulutuksenLaajuusIcon,
      title: 'Tutkintojen laajuus:',
      text: '150-180 osaamispistettä / tutkintotaso',
    },
    {
      icon: TutkintoonHakeminenIcon,
      title: 'Tutkintoon hakeminen:',
      text: 'Yhteishaku Jatkuva haku',
    },
  ],
};

const cardData = [
  {
    text: 'Kasvatusalat',
    icon: OpetusKasvatusPsykologiaIcon,
  },
  {
    text: 'Humanistiset ja taidealat',
    icon: OpetusKasvatusPsykologiaIcon,
  },
  {
    text: 'Yhteiskunnalliset alat',
    icon: OpetusKasvatusPsykologiaIcon,
  },
  {
    text: 'Kauppa ja halliinto',
    icon: OpetusKasvatusPsykologiaIcon,
  },
  {
    text: 'Luonnontieteet',
    icon: OpetusKasvatusPsykologiaIcon,
  },
  {
    text: 'Tietojenkäsittely ja tietoliikenne (ICT)',
    icon: OpetusKasvatusPsykologiaIcon,
  },
  {
    text: 'Tekniikat alat',
    icon: OpetusKasvatusPsykologiaIcon,
  },
  {
    text: 'Maa- ja metsätalous',
    icon: OpetusKasvatusPsykologiaIcon,
  },
  {
    text: 'Terveys- ja hyvinvointialat',
    icon: OpetusKasvatusPsykologiaIcon,
  },
  {
    text: 'Palvelualat',
    icon: OpetusKasvatusPsykologiaIcon,
  },
];

const uutisHelper = (data, noPics, greenTitle) => {
  const testiTeksti = `Ammatillisia tutkintoja ovat ammatilliset perustutkinnot, ammattitutkinnot ja erikoisammattitutkinnot.  Tässä osiossa kerrotaan yleisesti opinnoista ja tutkinnon suorittamisesta.`;
  if (!data) return;
  return Object.values(data)
    .slice(0, 3)
    .map((e) => ({
      title: e.name,
      text: testiTeksti,
      titleColor: greenTitle ? 'primary' : undefined,
      image: noPics
        ? undefined
        : {
            url:
              'http://images.ctfassets.net/4h0h2z8iv5uv/3p31bFzEUEkxtE2fAT7NQY/f2ebe5602b3890d45afd22a4b0fadc17/Screenshot_2019-10-01_at_10.09.36.png',
            title: 'moro',
          },
    }));
};
const AmmatillinenKoulutus = () => {
  const pads = {
    padding: '25px 90px',
  };
  const { contentfulStore } = useStores();

  return (
    <React.Fragment>
      <main id="main-content" className="center-content" style={pads}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h1">Ammatillinen koulutus</Typography>
          <InfoGrid
            heading="Perustiedot"
            id={infoGridData.id}
            gridData={infoGridData.infoGrid}
          />
          <div style={{ width: '50%' }}>
            <Markdown>{infoGridData.text}</Markdown>
          </div>
          {contentfulStore.data.uutinen ? (
            <InfoCardGrid
              title="Tutustu ammatilliseen koulutukseen"
              cards={uutisHelper(contentfulStore.data.uutinen)}
            />
          ) : null}
          <Tree id={'placeholder'} title="Koulutusalat" cards={cardData} />
          {contentfulStore.data.uutinen ? (
            <InfoCardGrid
              title="Polkuja ammatilliseen koulutukseen"
              cards={uutisHelper(contentfulStore.data.uutinen, true, true)}
            />
          ) : null}
          {contentfulStore.data.uutinen ? (
            <InfoCardGrid
              title="Muut ammatilliset koulutukset"
              cards={uutisHelper(contentfulStore.data.uutinen, true)}
            />
          ) : null}
        </Box>
      </main>
    </React.Fragment>
  );
};

export default observer(AmmatillinenKoulutus);
