import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks';
import { Typography, Box, Container } from '@material-ui/core';
import { Localizer as l } from '../../tools/Utils';
import { useTranslation } from 'react-i18next';
import KoulutusInfoGrid from './KoulutusInfoGrid';
import { makeStyles } from '@material-ui/styles';
import TextBox from '../common/TextBox';
import ToteutusList from './ToteutusList';
import HakuKaynnissaCard from './HakuKaynnissaCard';
import { HashLink as Link } from 'react-router-hash-link';
import Accordion from '../common/Accordion';
import Spacer from '../common/Spacer';
import clsx from 'clsx';
import { colors } from '../../colors';
import DefaultHeroImage from '../../assets/images/herokuva_default.png';

const useStyles = makeStyles((theme) => ({
  root: { marginTop: '100px' },
  lisatietoa: { width: '50%' },
  container: { backgroundColor: colors.white, maxWidth: '1600px' },
  heroImage: { maxWidth: '100%', height: 'auto' },
  imageContainer: { maxWidth: '1600px', maxHeight: '400px' },
  alatText: {
    ...theme.typography.body1,
    fontSize: '1.25rem',
  },
}));

const Koulutus = (props) => {
  const classes = useStyles();
  const { oid } = props.match.params;
  const { restStore } = useStores();
  const { t } = useTranslation();
  const [state, setState] = useState({
    kuvaus: {},
    koulutusAla: [],
    tutkintoNimi: {},
    tutkintoNimikkeet: [],
    opintojenLaajuus: {},
    opintojenLaajuusYksikkö: {},
    koulutusTyyppi: '',
    toteutukset: [],
    lisatiedot: [],
  });
  useEffect(() => {
    async function getData() {
      const [koulutusData, toteutukset] = await Promise.all([
        restStore.getKoulutusPromise(oid),
        restStore.getKoulutusJarjestajatPromise(oid),
      ]);
      const kuvausData = await restStore.getKuvausPromise(
        koulutusData.koulutus.koodiUri
      ); //TODO: Proper error handling
      setState({
        kuvaus: kuvausData.kuvaus,
        koulutusAla: koulutusData.metadata.koulutusala,
        tutkintoNimi: koulutusData.nimi,
        tutkintoNimikkeet: koulutusData.metadata.tutkintonimike,
        opintojenLaajuus: koulutusData.metadata.opintojenLaajuus,
        opintojenLaajuusYksikkö: koulutusData.metadata.opintojenLaajuusyksikko,
        koulutusTyyppi: koulutusData.metadata.tyyppi,
        toteutukset: toteutukset.hits,
        lisatiedot: koulutusData.metadata.lisatiedot,
      });
    }
    getData();
  }, [oid, restStore]);
  return (
    <Container className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mt={4}>
          {state.koulutusAla.map((ala) => (
            <Typography
              key={ala.koodiUri}
              className={classes.alatText}
              variant="h3"
              component="h1">
              {l.localize(ala)}
            </Typography>
          ))}
        </Box>
        <Box mt={1}>
          <Typography variant="h1" component="h2">
            {l.localize(state.tutkintoNimi)}
          </Typography>
        </Box>
        <Box className={classes.imageContainer} mt={7.5}>
          <img
            className={classes.heroImage}
            src={DefaultHeroImage}
            alt="Koulutuksen teemakuva"
          />
        </Box>
        <KoulutusInfoGrid
          className={classes.root}
          nimikkeet={state.tutkintoNimikkeet}
          koulutustyyppi={state.koulutusTyyppi}
          laajuus={[state.opintojenLaajuus, state.opintojenLaajuusYksikkö]}
        />
        {state.toteutukset?.length > 0 ? (
          <HakuKaynnissaCard
            title={t('koulutus.haku-kaynnissa')}
            text={t('koulutus.katso-jarjestavat')}
            link={
              <Link
                to="#tarjonta"
                aria-label="anchor"
                smooth
                style={{ textDecoration: 'none' }}
              />
            }
            buttonText={t('koulutus.nayta-oppilaitokset')}
          />
        ) : null}

        <TextBox
          heading={t('koulutus.kuvaus')}
          text={l.localize(state.kuvaus)}
          className={classes.root}
        />
        <Box id="tarjonta">
          <ToteutusList toteutukset={state.toteutukset} />
        </Box>
        {/* {state.lisatiedot ? (
          <Box
            className={clsx([classes.lisatietoa, classes.root])}
            display="flex"
            flexDirection="column"
            alignItems="center">
            <Typography variant="h2">{t('koulutus.lisätietoa')}</Typography>
            <Spacer />
            <Accordion
              items={state.lisatiedot.map((lisatieto) => ({
                title: l.localize(lisatieto.otsikko),
                content: l.localize(lisatieto.teksti),
              }))}
            />
          </Box>
        ) : null} */}
      </Box>
    </Container>
  );
};

export default observer(Koulutus);
