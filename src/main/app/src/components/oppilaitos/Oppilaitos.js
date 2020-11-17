import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box, Container, makeStyles } from '@material-ui/core';
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
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import OppilaitosOsaList from './OppilaitosOsaList';

const useStyles = makeStyles((theme) => ({
  root: { marginTop: '100px' },
  container: {
    backgroundColor: colors.white,
    maxWidth: '1600px',
  },
  title: { marginTop: 40 },
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
  const isOppilaitosOsa = props.oppilaitosOsa;
  const {
    esittelyHtml,
    oppilaitos,
    oppilaitosOsat,
    tarjonta,
    tietoaOpiskelusta,
    tulevaTarjonta,
    status,
  } = useSelector(getOppilaitosProps);
  const hakuUrl = useSelector(getHakuUrl);

  useEffect(() => {
    dispatch(fetchOppilaitosTarjontaData({ oid, isOppilaitosOsa }));
  }, [oid, dispatch, isOppilaitosOsa]);

  return status === 'loading' ? (
    <LoadingCircle />
  ) : (
    <Container className={classes.container}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box width="100%" alignSelf="start">
          <Murupolku
            path={[
              { name: t('haku.otsikko'), link: hakuUrl.url },
              { name: l.localize(oppilaitos ?? '') },
            ]}
          />
        </Box>
        <Box className={classes.title}>
          <Typography variant="h1" component="h2">
            {l.localize(_.get(oppilaitos, 'nimi', ''))}
          </Typography>
        </Box>
        <Box className={classes.imageContainer} mt={7.5}>
          <TeemakuvaImage
            imgUrl={oppilaitos?.oppilaitos?.teemakuva}
            altText={t('oppilaitos.oppilaitoksen-teemakuva')}
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
            <TarjontaList
              tarjonta={tarjonta}
              oid={oid}
              isOppilaitosOsa={isOppilaitosOsa}
            />
          </Box>
        )}
        {tulevaTarjonta?.total > 0 && (
          <Box id="tulevaTarjonta">
            <TulevaTarjontaList
              tulevaTarjonta={tulevaTarjonta}
              oid={oid}
              isOppilaitosOsa={isOppilaitosOsa}
            />
          </Box>
        )}

        {_.size(tietoaOpiskelusta) > 0 && (
          <TietoaOpiskelusta
            className={classes.root}
            heading={t('oppilaitos.tietoa-opiskelusta')}
            tietoaOpiskelusta={tietoaOpiskelusta}
          />
        )}
        {isOppilaitosOsa ? null : (
          <OppilaitosOsaList
            oppilaitosOsat={oppilaitosOsat}
            title={t('oppilaitos.tutustu-toimipisteisiin')}
          />
        )}
        <Yhteystiedot
          className={classes.root}
          heading={t('oppilaitos.yhteystiedot')}
          logo={oppilaitos?.oppilaitos?.logo}
          metadata={oppilaitos?.oppilaitos?.metadata}
          nimi={l.localize(oppilaitos?.nimi)}
        />
      </Box>
    </Container>
  );
};

export default Oppilaitos;
