import React from 'react';
import _ from 'lodash';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  formatDateString,
  Localizer as l,
  sanitizedHTMLParser,
  toId,
} from '#/src/tools/Utils';
import { colors } from '#/src/colors';
import Spacer from '#/src/components/common/Spacer';
import Accordion from '#/src/components/common/Accordion';

const renderLocalizedHTML = (transObj) => sanitizedHTMLParser(l.localize(transObj));

const SubHeading = ({ children }) => (
  <Typography variant="h5" style={{ fontWeight: 700, color: colors.grey }}>
    {children}
  </Typography>
);

const Tilaisuus = ({ alkaa, paattyy, lisatietoja, osoite, postinumero }) => {
  const { t } = useTranslation();
  return (
    <>
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
        <>
          <Grid item xs={12}>
            <Box py={1}>
              <SubHeading>{t('valintaperuste.osoite')}</SubHeading>
              <Typography variant="body1">
                {l.localizeOsoite(osoite, postinumero)}
              </Typography>
            </Box>
          </Grid>
        </>
      ) : null}
      {!_.isEmpty(lisatietoja) ? (
        <>
          <Grid item xs={12}>
            <Box py={1}>
              <SubHeading>{t('valintaperuste.lisatietoja')}</SubHeading>
              {renderLocalizedHTML(lisatietoja)}
            </Box>
          </Grid>
        </>
      ) : null}
    </>
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
  const { t } = useTranslation();
  return (
    <>
      <Box py={1}>
        <Typography variant="h2">{t('valintaperuste.valintakokeet')}</Typography>
        <Spacer />
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
                <SubHeading>{l.localize(nimi)}</SubHeading>
                {renderLocalizedHTML(tietoja)}
                {!_.isEmpty(ohjeetEnnakkovalmistautumiseen) && (
                  <>
                    <SubHeading>
                      {t('valintaperuste.valmistautumisohjeet-hakijalle')}
                    </SubHeading>
                    {renderLocalizedHTML(ohjeetEnnakkovalmistautumiseen)}
                  </>
                )}
                {!_.isEmpty(ohjeetErityisjarjestelyihin) && (
                  <>
                    <SubHeading>
                      {t('valintaperuste.ohjeet-erityisjarjestelyihin')}
                    </SubHeading>
                    {renderLocalizedHTML(ohjeetErityisjarjestelyihin) || '-'}
                  </>
                )}
                <Accordion
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
                          <Grid container key={`koetilaisuus-${index}`}>
                            <Tilaisuus
                              osoite={osoite}
                              lisatietoja={lisatietoja}
                              postinumero={postinumero}
                              alkaa={alkaa}
                              paattyy={paattyy}
                            />
                          </Grid>
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
