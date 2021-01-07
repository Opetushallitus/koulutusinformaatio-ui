import { Box, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '#/src/colors';
import Accordion from '#/src/components/common/Accordion';
import { formatDateString, Localizer as l, toId } from '#/src/tools/Utils';
import { Koodi, Translateable } from '#/src/types/common';
import { LocalizedHTML } from './LocalizedHTML';

const useStyles = makeStyles(() => ({
  valintakoeHeader: {
    fontSize: '20px',
  },
  valintakoeSubHeader: {
    fontWeight: 700,
    color: colors.darkGrey,
  },
}));

const SubHeading: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Typography variant="h5" className={classes.valintakoeSubHeader}>
      {children}
    </Typography>
  );
};

type TilaisuusProps = {
  alkaa: string;
  paattyy: string;
  lisatietoja: Translateable;
  osoite: Translateable;
  postinumero: Koodi;
  index: number;
  jarjestamispaikka: Translateable;
};

const Tilaisuus = ({
  alkaa,
  paattyy,
  lisatietoja,
  osoite,
  postinumero,
  index,
  jarjestamispaikka,
}: TilaisuusProps) => {
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
            <SubHeading>{t('valintaperuste.jarjestyspaikka')}</SubHeading>
            <Typography variant="body1">{l.localize(jarjestamispaikka)}</Typography>
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
            <LocalizedHTML data={lisatietoja!} defaultValue="-" />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export const ValintakokeetSisallysluettelo = (valintakokeet: any[]) => (Lnk: any) =>
  !_.isEmpty(valintakokeet)
    ? valintakokeet.map(({ nimi }, index) => Lnk(l.localize(nimi), index + 1, false))
    : null;

type Props = {
  valintakokeet: Array<{
    nimi: string;
    tyyppi: Koodi;
    tilaisuudet: Array<{
      lisatietoja: Translateable;
      jarjestamispaikka: Translateable;
      osoite: { osoite: Translateable; postinumero: Koodi };
      aika: { alkaa: string; paattyy: string };
    }>;
    metadata: {
      ohjeetErityisjarjestelyihin: Translateable;
      ohjeetEnnakkovalmistautumiseen: Translateable;
      tietoja: Translateable;
    };
  }>;
};

export const Valintakokeet = ({ valintakokeet }: Props) => {
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
              id={`${toId(l.localize(nimi))}`}
              elevation={0}
              style={{
                backgroundColor: colors.lightGrey,
                padding: '15px',
                marginBottom: '20px',
              }}>
              <CardContent>
                <Typography variant="body1">{localizedTyyppi}</Typography>
                <Typography className={classes.valintakoeHeader} variant="h4">
                  {l.localize(nimi)}
                </Typography>
                {!_.isEmpty(tietoja) && <LocalizedHTML data={tietoja!} />}
                {!_.isEmpty(ohjeetEnnakkovalmistautumiseen) && (
                  <>
                    <SubHeading>
                      {t('valintaperuste.valmistautumisohjeet-hakijalle')}
                    </SubHeading>
                    <LocalizedHTML data={ohjeetEnnakkovalmistautumiseen!} />
                  </>
                )}
                {!_.isEmpty(ohjeetErityisjarjestelyihin) && (
                  <>
                    <SubHeading>
                      {t('valintaperuste.ohjeet-erityisjarjestelyihin')}
                    </SubHeading>
                    <LocalizedHTML data={ohjeetErityisjarjestelyihin!} />
                  </>
                )}
                <Accordion
                  ContentWrapper={'div' as any}
                  items={tilaisuudet.map(
                    (
                      {
                        lisatietoja,
                        jarjestamispaikka,
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
                            jarjestamispaikka={jarjestamispaikka}
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
