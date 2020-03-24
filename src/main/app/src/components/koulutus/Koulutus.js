import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks';
import { Typography, Box, Container, makeStyles } from '@material-ui/core';
import { Localizer as l } from '../../tools/Utils';
import { useTranslation } from 'react-i18next';
import KoulutusInfoGrid from './KoulutusInfoGrid';
import TextBox from '../common/TextBox';
import ToteutusList from './ToteutusList';
import HakuKaynnissaCard from './HakuKaynnissaCard';
import { HashLink as Link } from 'react-router-hash-link';
import { colors } from '../../colors';
import DefaultHeroImage from '../../assets/images/herokuva_default.png';
import Murupolku from '../common/Murupolku';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
  fetchKoulutusWithRelatedData,
  selectKoulutus,
  selectLoading,
  selectJarjestajat,
} from '../../reducers/koulutusSlice';
import LoadingCircle from '../common/LoadingCircle';
import qs from 'query-string';

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
  const history = useHistory();
  const { draft } = qs.parse(history.location.search);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { oid } = useParams();
  const { hakuStore } = useStores();
  const { t } = useTranslation();
  const koulutus = useSelector((state) => selectKoulutus(state, oid), shallowEqual);
  const toteutukset = useSelector((state) => selectJarjestajat(state, oid));
  const loading = useSelector((state) => selectLoading(state));
  useEffect(() => {
    if (!koulutus) {
      dispatch(fetchKoulutusWithRelatedData(oid, draft));
    }
  }, [dispatch, koulutus, oid, draft]);

  return loading ? (
    <LoadingCircle />
  ) : (
    <Container className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mt={5} ml={9} alignSelf="start">
          <Murupolku
            path={[
              { name: t('koulutus.hakutulos'), link: hakuStore.createHakuUrl },
              { name: l.localize(koulutus?.tutkintoNimi) },
            ]}
          />
        </Box>
        <Box mt={4}>
          {koulutus?.koulutusAla?.map((ala) => (
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
            {l.localize(koulutus?.tutkintoNimi)}
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
          nimikkeet={koulutus?.tutkintoNimikkeet}
          koulutustyyppi={koulutus?.koulutusTyyppi}
          laajuus={[koulutus?.opintojenLaajuus, koulutus?.opintojenLaajuusYksikkö]}
        />
        {toteutukset?.length > 0 ? (
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
          text={l.localize(koulutus?.kuvaus)}
          className={classes.root}
        />
        <Box id="tarjonta">
          <ToteutusList toteutukset={toteutukset} />
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
