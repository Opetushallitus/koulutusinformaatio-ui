import {
  Box,
  Button,
  ButtonGroup,
  Divider,
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
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import Spacer from '#/src/components/common/Spacer';
import { HAKULOMAKE_TYYPPI } from '#/src/constants';
import { useOppilaitosOsoite } from '#/src/tools/UseOppilaitosOsoiteHook';
import { Localizer as l } from '#/src/tools/Utils';
import { formatAloitus } from './utils';
import { Hakukohde } from '#/src/types/ToteutusTypes';

const useStyles = makeStyles((theme) => ({
  gridHeading: {
    ...theme.typography.body1,
    fontWeight: 700,
  },
  hakuName: {
    ...theme.typography.h5,
    fontWeight: 700,
    color: colors.black,
  },
  lomakeButtonGroup: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  paper: {
    width: '100%',
    height: '100%',
    borderTop: `5px solid ${colors.brandGreen}`,
  },
}));

const getJarjestyspaikkaYhteystiedot = (
  jarjestyspaikka: Hakukohde['jarjestyspaikka'],
  osoitteet: Array<{ oppilaitosOid: string; yhteystiedot: string }>
) =>
  osoitteet.find((osoite) => osoite.oppilaitosOid === jarjestyspaikka.oid)?.yhteystiedot;

type GridProps = {
  tyyppiOtsikko: string;
  haut: Array<Hakukohde>;
  icon: JSX.Element;
};

const HakuCardGrid = ({ tyyppiOtsikko, haut, icon }: GridProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const oppilaitosOids = useMemo(() => haut.map((haku) => haku.jarjestyspaikka?.oid), [
    haut,
  ]);
  const osoitteet = useOppilaitosOsoite(oppilaitosOids);

  return (
    <Grid item>
      <Box ml={2} display="flex" justifyContent="center">
        {icon}
        <Box ml={2}>
          <Typography variant="h4">{`${tyyppiOtsikko} ( ${haut.length} )`}</Typography>
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
              haku.koulutuksenAlkamiskausi || {},
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
                            <Typography variant="body1">
                              {`${l.localize(
                                haku.jarjestyspaikka.nimi
                              )} · ${getJarjestyspaikkaYhteystiedot(
                                haku.jarjestyspaikka,
                                osoitteet
                              )}`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Divider />
                      </Grid>
                      <Grid item>
                        <Grid container direction="row" spacing={3}>
                          <Grid item xs={6}>
                            <Grid item>
                              <Typography className={classes.gridHeading} noWrap>
                                {t('toteutus.haku-alkaa:')}
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
                                content: haku.hakuajat.map(
                                  (hakuaika) =>
                                    hakuaika.paattyy
                                      ? format(new Date(hakuaika.paattyy), 'd.M.y H:mm')
                                      : '-' // This is needed for the alkuu & paattyy to be rendered on the same row
                                ),
                              },
                              alkaaText && {
                                size: paattyyText ? 6 : 12,
                                heading: t('toteutus.koulutus-alkaa:'),
                                content: [alkaaText],
                                modalText: alkaaModalText,
                              },
                              paattyyText && {
                                size: 6,
                                heading: t('toteutus.koulutus-paattyy:'),
                                content: [paattyyText],
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
                                content: [haku.aloituspaikat],
                              },
                            ]
                              .filter(Boolean)
                              // TODO: .filter(Boolean) does not clean false types from above array item types :(
                              .map(({ size, heading, content, modalText }: any) => (
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
                                    {content.map((v: string, i: number) => (
                                      <Typography
                                        key={`${heading}-text-${i}`}
                                        variant="body1">
                                        {v}
                                      </Typography>
                                    ))}
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
                                <Typography
                                  style={{ color: colors.white }}
                                  variant="body1">
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

                          <Button
                            variant="outlined"
                            size="large"
                            color="primary"
                            // TODO: This is a really complex way to make a button with localized route link
                            component={React.forwardRef(
                              ({ children, ...rest }, ignored) => (
                                <LocalizedLink
                                  underline="none"
                                  component={RouterLink}
                                  to={`/hakukohde/${haku.hakukohdeOid}/valintaperuste`}
                                  {...rest}>
                                  {children}
                                </LocalizedLink>
                              )
                            )}>
                            <Typography
                              style={{ color: colors.brandGreen }}
                              variant="body1">
                              {t('toteutus.lue-valintaperusteet')}
                            </Typography>
                          </Button>
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

type Props = {
  jatkuvatHaut: Array<Hakukohde>;
  erillisHaut: Array<Hakukohde>;
  yhteisHaut: Array<Hakukohde>;
};

export const ToteutusHakukohteet = ({ jatkuvatHaut, erillisHaut, yhteisHaut }: Props) => {
  const { t } = useTranslation();

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
        {jatkuvatHaut?.length > 0 && (
          <HakuCardGrid
            tyyppiOtsikko={t('toteutus.jatkuvahaku')}
            haut={jatkuvatHaut}
            icon={<AutorenewIcon />}
          />
        )}
        {yhteisHaut?.length > 0 && (
          <HakuCardGrid
            tyyppiOtsikko={t('toteutus.yhteishaku')}
            haut={yhteisHaut}
            icon={<CalendarTodayOutlinedIcon />}
          />
        )}
        {erillisHaut?.length > 0 && (
          <HakuCardGrid
            tyyppiOtsikko={t('toteutus.erillishaku')}
            haut={erillisHaut}
            icon={<CalendarTodayOutlinedIcon />}
          />
        )}
      </Grid>
    </Box>
  );
};
