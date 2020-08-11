import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box, Container, makeStyles, Hidden } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Localizer as l } from '#/src/tools/Utils';
import _ from 'lodash';
import { fetchOppilaitosTarjontaData } from '#/src/store/reducers/oppilaitosSlice';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { getOppilaitosProps } from '#/src/store/reducers/oppilaitosSliceSelector';
import { colors } from '#/src/colors';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import Murupolku from '#/src/components/common/Murupolku';
import LoadingCircle from '#/src/components/common/LoadingCircle';
import OppilaitosinfoGrid from './OppilaitosinfoGrid';
import TarjontaList from './TarjontaList';
import TietoaOpiskelusta from './TietoaOpiskelusta';
import Yhteystiedot from './Yhteystiedot';
import TulevaTarjontaList from './TulevaTarjontaList';
import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';

const useStyles = makeStyles((theme) => ({
  root: { marginTop: '100px' },
  container: {
    backgroundColor: colors.white,
    maxWidth: '1600px',
  },
  title: { marginTop: 40 },
  heroImage: { maxWidth: '100%', height: 'auto' },
  imageContainer: { maxWidth: '1600px', maxHeight: '400px' },
  alatText: {
    ...theme.typography.body1,
    fontSize: '1.25rem',
  },
}));

const Oppilaitos = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { oid } = useParams();
  const { t } = useTranslation();
  const {
    esittelyHtml,
    oppilaitos,
    tarjonta,
    tietoaOpiskelusta,
    tulevaTarjonta,
    status,
  } = useSelector(getOppilaitosProps);
  const hakuUrl = useSelector(getHakuUrl);

  useEffect(() => {
    dispatch(fetchOppilaitosTarjontaData({ oid }));
  }, [oid, dispatch]);

  return status === 'loading' ? (
    <LoadingCircle />
  ) : (
    <Container className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Hidden smDown>
          <Box alignSelf="start">
            <Murupolku
              path={[
                { name: t('koulutus.hakutulos'), link: hakuUrl.url },
                { name: l.localize(_.get(oppilaitos, 'nimi', '')) },
              ]}
            />
          </Box>
        </Hidden>
        <Box className={classes.title}>
          <Typography variant="h1" component="h2">
            {l.localize(_.get(oppilaitos, 'nimi', ''))}
          </Typography>
        </Box>
        <Box className={classes.imageContainer} mt={7.5}>
          <img
            className={classes.heroImage}
            src={_.get(oppilaitos, 'oppilaitos.teemakuva') || DefaultHeroImage}
            alt="Koulutuksen teemakuva"
          />
        </Box>
        <OppilaitosinfoGrid
          className={classes.root}
          opiskelijoita={_.get(oppilaitos, 'oppilaitos.metadata.opiskelijoita', '')}
          toimipisteita={_.get(oppilaitos, 'oppilaitos.metadata.toimipisteita', '')}
          kotipaikat={_.map(_.get(oppilaitos, 'osat', []), 'kotipaikka')}
          opetuskieli={_.get(oppilaitos, 'opetuskieli', [])}
          koulutusohjelmia={_.get(oppilaitos, 'koulutusohjelmia', '')}
        />
        {esittelyHtml && (
          <HtmlTextBox
            heading={t('oppilaitos.esittely')}
            html={esittelyHtml}
            className={classes.root}
          />
        )}

        {tarjonta?.total > 0 && (
          <Box id="tarjonta">
            <TarjontaList tarjonta={tarjonta} oid={oid} />
          </Box>
        )}
        {tulevaTarjonta?.total > 0 && (
          <Box id="tulevaTarjonta">
            <TulevaTarjontaList tulevaTarjonta={tulevaTarjonta} oid={oid} />
          </Box>
        )}

        {_.size(tietoaOpiskelusta) > 0 && (
          <TietoaOpiskelusta
            className={classes.root}
            heading={t('oppilaitos.tietoa-opiskelusta')}
            tietoaOpiskelusta={tietoaOpiskelusta}
          />
        )}

        <Yhteystiedot
          className={classes.root}
          heading={t('oppilaitos.yhteystiedot')}
          logo={_.get(oppilaitos, 'oppilaitos.logo', DefaultHeroImage)}
          metadata={_.get(oppilaitos, 'oppilaitos.metadata')}
          nimi={l.localize(_.get(oppilaitos, 'nimi'))}
        />
      </Box>
    </Container>
  );
};

export default Oppilaitos;
