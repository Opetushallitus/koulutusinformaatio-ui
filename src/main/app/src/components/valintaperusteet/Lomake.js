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
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { formatDateRange, Localizer as l } from '#/src/tools/Utils';
import { isHakuAuki } from '#/src/tools/hakuaikaUtils';
import { colors } from '#/src/colors';
import LocalizedLink from '#/src/components/common/LocalizedLink';

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

const Row = ({ title, children }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Typography variant="body2" component="p">
          {title}
          {':'}
        </Typography>
      </Grid>
      <Grid item xs={9}>
        {children}
      </Grid>
    </Grid>
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

  const isOpen = isHakuAuki(_.concat(haku.hakuajat, hakukohde.hakuajat));

  return (
    <>
      <Box pb={2}>
        <Typography variant="h1" component="h1">
          {t('lomake.valintaperusteet')}
        </Typography>
      </Box>
      <Card className={classes.card} elevation={2}>
        <CardContent>
          <Grid container direction="row" spacing={4}>
            <Grid item>
              <Typography variant="h4" component="h4">
                {l.localize(hakukohde?.nimi)}
                {isOpen && (
                  <StyledBadge
                    badgeContent={t('valintaperuste.haku-kaynnissa')}
                    color="secondary"
                  />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Row title={t('valintaperuste.haku')}>{l.localize(haku?.nimi)}</Row>
              <Row title={t('valintaperuste.hakuaika')}>
                {hakuaika ? formatDateRange(hakuaika[0], hakuaika[1]) : '-'}
              </Row>
              {Boolean(aloituspaikat) && (
                <Row title={t('valintaperuste.opiskelupaikkoja')}>
                  {`${aloituspaikat} ${
                    ensikertalaisille
                      ? t('lomake.ensikertalaisille', { ensikertalaisille })
                      : ''
                  }`}
                </Row>
              )}
              <Row title={t('valintaperuste.pohjakoulutus')}>-</Row>
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
              <LocalizedLink
                component={RouterLink}
                to={paluuLinkki}
                style={{ textDecoration: 'none' }}>
                <LomakeButton>{t('lomake.palaa-esittelyyn')}</LomakeButton>
              </LocalizedLink>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};
