import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import { format } from 'date-fns';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '#/src/colors';
import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import Spacer from '#/src/components/common/Spacer';
import { HAKULOMAKE_TYYPPI } from '#/src/constants';
import { useOppilaitosOsoite } from '#/src/tools/UseOppilaitosOsoiteHook';
import { Localizer as l } from '#/src/tools/Utils';
import { formatAloitus } from './utils';

const useStyles = makeStyles((theme) => ({
  gridHeading: {
    ...theme.typography.body1,
    fontWeight: '700',
  },
  hakuName: {
    ...theme.typography.h5,
    fontWeight: '700',
    color: colors.black,
  },
  lomakeButtonGroup: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
}));

const getJarjestyspaikkaYhteystiedot = (jarjestyspaikka, osoitteet) =>
  osoitteet.find((osoite) => osoite.oppilaitosOid === jarjestyspaikka.oid)?.yhteystiedot;

const HakuCardGrid = (props) => {
  const classes = useStyles();
  const { type, haut, icon } = props;
  const { t } = useTranslation();

  const oppilaitosOids = useMemo(() => haut.map((haku) => haku.jarjestyspaikka?.oid), [
    haut,
  ]);
  const osoitteet = useOppilaitosOsoite(oppilaitosOids);

  return (
    <Grid item>
      <Box display="flex" alignItems="center">
        {icon}
        <Box ml={2}>
          <Typography variant="h4">{`${type} ( ${haut.length} )`}</Typography>
        </Box>
      </Box>
      <Box mt={4}>
        <Grid
          container
          spacing={2}
          alignContent="center"
          justify="center"
          alignItems="center">
          {haut.map((haku) => {
            const anyHakuaikaPaattyy = haku.hakuajat?.some(
              (hakuaika) => hakuaika.paattyy
            );
            const { alkaaText, alkaaModalText, paattyyText } = formatAloitus(
              haku.koulutuksenAlkamiskausi,
              t
            );

            return (
              <Grid
                key={haku.hakukohdeOid}
                item
                xs={12}
                lg={6}
                style={{ maxWidth: '624px', height: '100%' }}>
                <Paper
                  style={{
                    width: '100%',
                    height: '100%',
                    borderTop: `5px solid #43A047`,
                  }}>
                  <Box m={4}>
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography className={classes.hakuName}>
                              {l.localize(haku.nimi)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body1" noWrap>
                              {l.localize(haku.hakulomakeKuvaus)}
                            </Typography>
                          </Grid>
                          {haku.jarjestyspaikka && (
                            <Grid item>
                              <Typography variant="body1">
                                {`${l.localize(
                                  haku.jarjestyspaikka.nimi
                                )} · ${getJarjestyspaikkaYhteystiedot(
                                  haku.jarjestyspaikka,
                                  osoitteet
                                )}`}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item>
                        <div
                          style={{
                            height: '0px',
                            borderTop: '1px solid #B2B2B2',
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Grid container direction="row" spacing={3}>
                          {[
                            {
                              size: anyHakuaikaPaattyy ? 6 : 12,
                              heading: t('toteutus.haku-alkaa:'),
                              content: haku.hakuajat.map((hakuaika) =>
                                format(new Date(hakuaika.alkaa), 'd.M.y H:mm')
                              ),
                            },
                            anyHakuaikaPaattyy && {
                              size: 6,
                              heading: t('toteutus.haku-paattyy:'),
                              content: haku.hakuajat.map((hakuaika) =>
                                hakuaika.paattyy
                                  ? format(new Date(hakuaika.paattyy), 'd.M.y H:mm')
                                  : null
                              ),
                            },
                            alkaaText && {
                              size: paattyyText ? 6 : 12,
                              heading: t('toteutus.koulutus-alkaa:'),
                              content: alkaaText,
                              modalText: alkaaModalText,
                            },
                            paattyyText && {
                              size: 6,
                              heading: t('toteutus.koulutus-paattyy:'),
                              content: paattyyText,
                            },
                            {
                              size: 6,
                              heading: t('toteutus.pohjakoulutus:'),
                              content: haku.pohjakoulutusvaatimus.map((vaatimus) =>
                                l.localize(vaatimus)
                              ),
                              modalText: haku.pohjakoulutusvaatimusTarkenne,
                            },
                            haku.aloituspaikat && {
                              size: 6,
                              heading: t('toteutus.opiskelupaikkoja:'),
                              content: haku.aloituspaikat,
                            },
                          ]
                            .filter(Boolean)
                            .map(({ size, heading, content, modalText }) => (
                              <Grid key={heading} item xs={size}>
                                <Grid
                                  item
                                  container
                                  spacing={1}
                                  wrap="nowrap"
                                  alignItems="flex-start">
                                  <Grid item>
                                    <Typography className={classes.gridHeading} noWrap>
                                      {heading}
                                    </Typography>
                                  </Grid>
                                  {!_.isEmpty(modalText) && (
                                    <Grid item>
                                      <LabelTooltip
                                        title={
                                          <LocalizedHTML noMargin data={modalText} />
                                        }
                                      />
                                    </Grid>
                                  )}
                                </Grid>
                                <Grid item>
                                  <Typography variant="body1" noWrap>
                                    {content}
                                  </Typography>
                                </Grid>
                              </Grid>
                            ))}
                        </Grid>
                      </Grid>
                      <Grid item>
                        <ButtonGroup
                          className={classes.lomakeButtonGroup}
                          orientation="horizontal"
                          color="primary">
                          {haku.hakulomaketyyppi !== HAKULOMAKE_TYYPPI.EI_SAHKOISTA && (
                            <Button
                              variant="contained"
                              size="large"
                              color="primary"
                              target="_blank"
                              href={l.localize(haku.hakulomakeLinkki)}
                              disabled={!haku.isHakuAuki}>
                              <Typography style={{ color: colors.white }} variant="body1">
                                {t('toteutus.tayta-lomake')}
                              </Typography>
                            </Button>
                          )}
                          {haku.valintaperusteId && (
                            <LocalizedLink
                              underline="none"
                              component={RouterLink}
                              to={`/hakukohde/${haku.hakukohdeOid}/valintaperuste`}>
                              <Button variant="outlined" size="large" color="primary">
                                <Typography
                                  style={{ color: colors.brandGreen }}
                                  variant="body1">
                                  {t('toteutus.lue-valintaperusteet')}
                                </Typography>
                              </Button>
                            </LocalizedLink>
                          )}
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
};

export const ToteutusHakukohteet = (props) => {
  const { t } = useTranslation();
  const { jatkuvatHaut, erillisHaut, yhteisHaut } = props;
  return (
    <Box
      pt={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      id="haut"
      style={{ width: '100%' }}>
      <Typography variant="h2">{t('toteutus.koulutuksen-hakukohteet')}</Typography>
      <Spacer />
      <Grid container direction="column" spacing={6}>
        {jatkuvatHaut?.length > 0 ? (
          <HakuCardGrid
            type={t('toteutus.jatkuvahaku')}
            haut={jatkuvatHaut}
            icon={<AutorenewIcon />}
          />
        ) : null}
        {yhteisHaut?.length > 0 ? (
          <HakuCardGrid
            type={t('toteutus.yhteishaku')}
            haut={yhteisHaut}
            icon={<CalendarTodayOutlinedIcon />}
          />
        ) : null}
        {erillisHaut?.length > 0 ? (
          <HakuCardGrid
            type={t('toteutus.erillishaku')}
            haut={erillisHaut}
            icon={<CalendarTodayOutlinedIcon />}
          />
        ) : null}
      </Grid>
    </Box>
  );
};
