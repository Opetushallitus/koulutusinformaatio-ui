import React from 'react';
import _ from 'lodash';
import {
  Grid,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  withStyles,
  makeStyles,
} from '@material-ui/core';
import { isWithinInterval } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { formatDateRange, Localizer as l } from '#/src/tools/Utils';
import Spacer from '#/src/components/common/Spacer';
import { colors } from '#/src/colors';

const useStyles = makeStyles({
  card: {
    padding: '15px',
  },
});

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -75,
    border: `2px solid ${colors.beigeGreen}`,
    backgroundColor: colors.beigeGreen,
    color: colors.black,
    padding: '0 4px',
    borderRadius: '0px',
    whiteSpace: 'nowrap',
  },
}))(Badge);

const parseHakuajat = (hakuajat) =>
  hakuajat.map((h) => [
    new Date(Date.parse(h.alkaa)),
    h.paattyy ? new Date(Date.parse(h.paattyy)) : null,
  ]);

const firstOnGoingDate = (dates, now) => {
  return _.find(dates, ([a, l]) => a <= now && (!l || now <= l));
};

const LomakeButton = ({ children, ...props }) => {
  return (
    <Button
      variant="contained"
      aria-label={children}
      color="primary"
      target="_blank"
      {...props}>
      {children}
    </Button>
  );
};

export const Lomake = ({ haku, hakukohde, paluuLinkki }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const hakuajat = parseHakuajat(haku.hakuajat);
  const now = new Date();
  const hakuaika = firstOnGoingDate(hakuajat, now) || _.first(hakuajat);
  const aloituspaikat = hakukohde.aloituspaikat;
  const ensikertalaisille = hakukohde.ensikertalaisenAloituspaikat;
  const Row = ({ title, children }) => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body2" component="p">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {children}
        </Grid>
      </Grid>
    );
  };
  const lomakeIsOpen = (hakuajat) =>
    hakuajat.some((hakuaika) => {
      const now = new Date();
      return isWithinInterval(now, {
        start: hakuaika.alkaa ? new Date(hakuaika.alkaa) : now,
        end: hakuaika.paattyy ? new Date(hakuaika.paattyy) : now,
      });
    });
  const isOpen = lomakeIsOpen(_.concat(haku.hakuajat, hakukohde.hakuajat));
  return (
    <>
      <Box pb={2}>
        <Typography variant="h1" component="h1">
          {t('lomake.valintaperusteet')}
        </Typography>
        <Spacer />
      </Box>
      <Card className={classes.card} elevation={2}>
        <CardContent>
          <Grid container direction="row" spacing={4}>
            <Grid item>
              <Typography variant="h4" component="h4">
                {l.localize(hakukohde?.nimi)}
                {isOpen ? (
                  <StyledBadge
                    badgeContent={t('toteutus.haku-kaynnisa')}
                    color="secondary"
                  />
                ) : null}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Row title={'Haku:'}>{l.localize(haku?.nimi)}</Row>
              <Row title={'Hakuaika:'}>
                {hakuaika ? formatDateRange(hakuaika[0], hakuaika[1]) : '-'}
              </Row>
              {aloituspaikat ? (
                <Row title={'Opiskelupaikkoja:'}>
                  {`${aloituspaikat} ${
                    ensikertalaisille
                      ? t('lomake.ensikertalaisille', { ensikertalaisille })
                      : ''
                  }`}
                </Row>
              ) : null}
              <Row title={'Pohjakoulutus:'}>-</Row>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <LomakeButton
                href={l.localize(hakukohde.hakulomakeLinkki)}
                disabled={!isOpen}>
                {t('lomake.tayta-lomake')}
              </LomakeButton>
            </Grid>
            <Grid item>
              <LomakeButton href={`/konfo${paluuLinkki}`} variant="outlined">
                {t('lomake.palaa-esittelyyn')}
              </LomakeButton>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};
