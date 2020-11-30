import React from 'react';
import _ from 'lodash';
import { Box, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  formatDateString,
  Localizer as l,
  sanitizedHTMLParser,
  toId,
} from '#/src/tools/Utils';
import { colors } from '#/src/colors';
import Accordion from '#/src/components/common/Accordion';

const useStyles = makeStyles((theme) => ({
  html: {
    ...theme.typography.body1,
    '& p': {
      marginTop: '8px',
      marginBottom: '20px',
    },
  },
  valintakoeHeader: {
    fontSize: '20px',
  },
  valintakoeSubHeader: {
    fontWeight: 700,
    color: colors.grey,
  },
}));

const LocalizedHTML = ({ data, defaultValue }) => {
  const classes = useStyles();
  return (
    <div className={classes.html}>
      {sanitizedHTMLParser(l.localize(data)) || defaultValue}
    </div>
  );
};

const SubHeading = ({ children }) => {
  const classes = useStyles();
  return (
    <Typography variant="h5" className={classes.valintakoeSubHeader}>
      {children}
    </Typography>
  );
};

const Tilaisuus = ({ alkaa, paattyy, lisatietoja, osoite, postinumero, index }) => {
  const { t } = useTranslation();
  return (
    <Grid style={{ padding: '10px 20px' }} container key={`koetilaisuus-${index}`}>
      <Grid item xs={6}>
        <Box py={1}>
          <SubHeading>{t('valintaperuste.alkaa')}</SubHeading>
          <Typography variant="body1">{formatDateString(alkaa)}</Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box py={1}>
          <SubHeading>{t('valintaperuste.paattyy')}</SubHeading>
          <Typography variant="body1">{formatDateString(paattyy)}</Typography>
        </Box>
      </Grid>
      {postinumero ? (
        <Grid item xs={12}>
          <Box py={1}>
            <SubHeading>{t('valintaperuste.osoite')}</SubHeading>
            <Typography variant="body1">
              {l.localizeOsoite(osoite, postinumero)}
            </Typography>
          </Box>
        </Grid>
      ) : null}
      {!_.isEmpty(lisatietoja) && (
        <Grid item xs={12}>
          <Box py={1}>
            <SubHeading>{t('valintaperuste.lisatietoja')}</SubHeading>
            <LocalizedHTML data={lisatietoja} defaultValue="-" />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export const ValintakokeetSisallysluettelo = (valintakokeet) => (Lnk) => {
  return !_.isEmpty(valintakokeet)
    ? valintakokeet.map(({ tyyppi: { nimi } }, index) => {
        return Lnk(l.localize(nimi), index + 1, true);
      })
    : null;
};

export const Valintakokeet = ({ valintakokeet }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <Box py={1}>
        <Typography variant="h2">{t('valintaperuste.valintakokeet')}</Typography>
      </Box>
      {valintakokeet.map(({ nimi, tyyppi, tilaisuudet, metadata = {} }, index) => {
        const localizedTyyppi = l.localize(tyyppi?.nimi);
        const {
          ohjeetErityisjarjestelyihin,
          ohjeetEnnakkovalmistautumiseen,
          tietoja,
        } = metadata;
        return (
          <div key={`valintakoe-${index}`}>
            <Card
              elevation={0}
              style={{
                backgroundColor: colors.veryLightGrey,
                padding: '15px',
                marginBottom: '20px',
              }}>
              <CardContent>
                <Typography id={`${toId(localizedTyyppi)}-${index + 1}`} variant="body1">
                  {localizedTyyppi}
                </Typography>
                <Typography className={classes.valintakoeHeader} variant="h4">
                  {l.localize(nimi)}
                </Typography>
                <LocalizedHTML data={tietoja} />
                {!_.isEmpty(ohjeetEnnakkovalmistautumiseen) && (
                  <>
                    <SubHeading>
                      {t('valintaperuste.valmistautumisohjeet-hakijalle')}
                    </SubHeading>
                    <LocalizedHTML data={ohjeetEnnakkovalmistautumiseen} />
                  </>
                )}
                {!_.isEmpty(ohjeetErityisjarjestelyihin) && (
                  <>
                    <SubHeading>
                      {t('valintaperuste.ohjeet-erityisjarjestelyihin')}
                    </SubHeading>
                    <LocalizedHTML data={ohjeetErityisjarjestelyihin} />
                  </>
                )}
                <Accordion
                  ContentWrapper="div"
                  items={tilaisuudet.map(
                    (
                      {
                        lisatietoja,
                        osoite: { osoite, postinumero },
                        aika: { alkaa, paattyy },
                      },
                      index
                    ) => {
                      return {
                        title: `${t('valintaperuste.tilaisuus')} ${index + 1}`,
                        content: (
                          <Tilaisuus
                            osoite={osoite}
                            lisatietoja={lisatietoja}
                            postinumero={postinumero}
                            alkaa={alkaa}
                            paattyy={paattyy}
                            index={index}
                          />
                        ),
                      };
                    }
                  )}
                />
              </CardContent>
            </Card>
          </div>
        );
      })}
    </>
  );
};
