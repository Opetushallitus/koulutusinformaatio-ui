import React from 'react';

import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { colors } from '#/src/colors';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import { NotFound } from '#/src/NotFound';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { localize } from '#/src/tools/localization';
import { condArray } from '#/src/tools/Utils';

import { useUrlParams } from '../hakutulos/UseUrlParams';
import { useOppilaitos } from './hooks';
import { OppilaitosinfoGrid } from './OppilaitosinfoGrid';
import OppilaitosOsaList from './OppilaitosOsaList';
import TarjontaList from './TarjontaList';
import { TietoaOpiskelusta } from './TietoaOpiskelusta';
import { TulevaTarjontaList } from './TulevaTarjontaList';
import { Yhteystiedot } from './Yhteystiedot';

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

export const OppilaitosPage = (props) => {
  const classes = useStyles();
  const { oid } = useParams();
  const { t } = useTranslation();
  const isOppilaitosOsa = props.oppilaitosOsa;
  const { isDraft } = useUrlParams();

  const { data: entity = {}, status } = useOppilaitos({
    oid,
    isOppilaitosOsa,
    isDraft,
  });

  const { esittelyHtml, oppilaitosOsat, tietoaOpiskelusta } = entity;

  const hakuUrl = useSelector(getHakuUrl);

  switch (status) {
    case 'loading':
      return <LoadingCircle />;
    case 'error':
      return <NotFound />;
    case 'success':
      return (
        <Container className={classes.container}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box width="100%" alignSelf="start">
              <Murupolku
                path={[
                  { name: t('haku.otsikko'), link: hakuUrl.url },
                  ...condArray(isOppilaitosOsa, {
                    name: localize(entity?.oppilaitos),
                    link: `/oppilaitos/${entity?.oppilaitos?.oid}`,
                  }),
                  {
                    name: localize(entity),
                  },
                ]}
              />
            </Box>
            <Box className={classes.title}>
              <Typography variant="h1" component="h2">
                {localize(entity)}
              </Typography>
            </Box>
            <Box className={classes.imageContainer} mt={7.5}>
              <TeemakuvaImage
                imgUrl={entity?.teemakuva}
                altText={t('oppilaitos.oppilaitoksen-teemakuva')}
              />
            </Box>
            <OppilaitosinfoGrid
              className={classes.root}
              opiskelijoita={entity?.metadata?.opiskelijoita ?? ''}
              toimipisteita={
                isOppilaitosOsa ? undefined : entity?.metadata?.toimipisteita
              }
              kotipaikat={entity?.kotipaikat}
              opetuskieli={entity?.opetuskieli ?? []}
              koulutusohjelmia={entity?.koulutusohjelmia ?? ''}
            />
            {esittelyHtml && (
              <HtmlTextBox
                heading={t('oppilaitos.esittely')}
                html={esittelyHtml}
                className={classes.root}
              />
            )}

            <TarjontaList oid={oid} isOppilaitosOsa={isOppilaitosOsa} />
            <TulevaTarjontaList oid={oid} isOppilaitosOsa={isOppilaitosOsa} />

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
              logo={entity?.logo}
              yhteystiedot={entity?.metadata?.yhteystiedot}
              nimi={localize(entity)}
            />
          </Box>
        </Container>
      );
    default:
      return null;
  }
};
