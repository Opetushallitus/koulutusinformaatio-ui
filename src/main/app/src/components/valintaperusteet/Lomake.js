import React from 'react';
import Button from '@material-ui/core/Button';
import { Grid, Box, Card, CardContent, CardActions, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Localizer as l } from '../../tools/Utils';
import { first, find, concat } from 'lodash';
import Spacer from '#/src/components/common/Spacer';
import { colors } from '#/src/colors';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import { isWithinInterval } from 'date-fns';

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
  return find(dates, ([a, l]) => a <= now && (!l || now <= l));
};

const formatHakuaika = ([a, l], klo) => {
  const toString = (d) =>
    `${d.getDay()}.${d.getMonth()}.${d.getFullYear()} ${klo} ${String(
      d.getHours()
    ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${toString(a)} ${l ? ' - ' + toString(l) : ''}`;
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

const Lomake = ({ haku, hakukohde, paluuLinkki }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const hakuajat = parseHakuajat(haku.hakuajat);
  const now = new Date();
  const hakuaika = firstOnGoingDate(hakuajat, now) || first(hakuajat);
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
  const isOpen = lomakeIsOpen(concat(haku.hakuajat, hakukohde.hakuajat));
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
                {hakuaika ? formatHakuaika(hakuaika, t('lomake.klo')) : '-'}
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

export default Lomake;
