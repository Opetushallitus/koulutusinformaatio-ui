import React from 'react';

import { Box, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { Accordion } from '#/src/components/common/Accordion';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { formatDateString, Localizer as l, toId } from '#/src/tools/Utils';
import { Koodi, Translateable } from '#/src/types/common';

const useStyles = makeStyles(() => ({
  valintakoeHeader: {
    fontSize: '20px',
    color: colors.darkGrey,
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
  index: number;
  tilaisuus: Tilaisuus;
};

const TilaisuusComponent = ({
  index,
  tilaisuus: {
    lisatietoja,
    jarjestamispaikka,
    osoite: { osoite, postinumero },
    aika: { alkaa, paattyy },
  },
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

export const ValintakokeetSisallysluettelo = (valintakokeet: Array<any>) => (Lnk: any) =>
  !_.isEmpty(valintakokeet)
    ? valintakokeet.map(({ nimi }, index) => Lnk(l.localize(nimi), index + 1, false))
    : null;

type Tilaisuus = {
  lisatietoja: Translateable;
  jarjestamispaikka: Translateable;
  osoite: { osoite: Translateable; postinumero: Koodi };
  aika: { alkaa: string; paattyy: string };
};

type Props = {
  valintakokeet: Array<{
    nimi: string;
    tyyppi: Koodi;
    tilaisuudet: Array<Tilaisuus>;
    metadata: {
      ohjeetErityisjarjestelyihin: Translateable;
      ohjeetEnnakkovalmistautumiseen: Translateable;
      tietoja: Translateable;
      vahimmaispisteet?: number;
    };
  }>;
  yleiskuvaukset: {
    valintaperuste: Translateable;
    hakukohde: Translateable;
  };
};

export const Valintakokeet = ({
  yleiskuvaukset: {
    valintaperuste: valintaperusteYk,
    hakukohde: hakukohdeYk,
  } = {} as Props['yleiskuvaukset'],
  valintakokeet = [],
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Box py={1}>
        <Typography variant="h2">{t('valintaperuste.valintakokeet')}</Typography>
      </Box>
      {valintaperusteYk && (
        <Box py={1}>
          <Typography variant="h3">
            {t('valintaperuste.valintakokeet-yleiskuvaus-valintaperuste')}
          </Typography>
          <LocalizedHTML data={valintaperusteYk} />
        </Box>
      )}
      {hakukohdeYk && (
        <Box py={1}>
          <Typography variant="h3">
            {t('valintaperuste.valintakokeet-yleiskuvaus-hakukohde')}
          </Typography>
          <LocalizedHTML data={hakukohdeYk} />
        </Box>
      )}
      {valintakokeet.map(({ nimi, tyyppi, tilaisuudet, metadata = {} }, index) => {
        const localizedTyyppi = l.localize(tyyppi?.nimi);
        const {
          ohjeetErityisjarjestelyihin,
          ohjeetEnnakkovalmistautumiseen,
          tietoja,
          vahimmaispisteet,
        } = metadata;

        return (
          <div key={`valintakoe-${index}`}>
            <Card
              id={`${toId(l.localize(nimi))}`}
              elevation={0}
              style={{
                backgroundColor: colors.grey,
                padding: '15px',
                marginBottom: '20px',
              }}>
              <CardContent>
                <Typography variant="body1">{localizedTyyppi}</Typography>
                <Typography className={classes.valintakoeHeader} variant="h4">
                  {l.localize(nimi)}
                </Typography>
                {!_.isEmpty(tietoja) && <LocalizedHTML data={tietoja!} />}
                {vahimmaispisteet && (
                  <>
                    <SubHeading>
                      {t('valintaperuste.alin-hyvaksytty-pistemaara')}
                    </SubHeading>
                    <Typography variant="body1">{vahimmaispisteet}</Typography>
                  </>
                )}
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
                {tilaisuudet.length > 0 && (
                  <Box mt={2}>
                    <Accordion
                      noColors
                      ContentWrapper={'div' as any}
                      items={tilaisuudet.map((tilaisuus, index) => ({
                        title: `${t('valintaperuste.tilaisuus')} ${index + 1}`,
                        content: (
                          <TilaisuusComponent index={index} tilaisuus={tilaisuus} />
                        ),
                      }))}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </>
  );
};
