import React, { useEffect } from 'react';
import ContentWrapper from '../common/ContentWrapper';
import { Box, Typography, makeStyles, Grid, Hidden } from '@material-ui/core';
import { HashLink } from 'react-router-hash-link';
import { colors } from '#/src/colors';
import ToteutusInfoGrid from './ToteutusInfoGrid';
import ToteutusHakukohteet from './ToteutusHakukohteet';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import LoadingCircle from '#/src/components/common/LoadingCircle';
import Spacer from '#/src/components/common/Spacer';
import Accordion from '#/src/components/common/Accordion';
import { Localizer as l } from '#/src/tools/Utils';
import HakuKaynnissaCard from '#/src/components/koulutus/HakuKaynnissaCard';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import isEmpty from 'lodash/isEmpty';
import {
  fetchToteutus,
  selectLoading as selectToteutusLoading,
  selectToteutus,
  selectJatkuvatHaut,
  selectYhteisHaut,
  selectErillisHaut,
} from '#/src/store/reducers/toteutusSlice';
import {
  fetchKoulutusWithRelatedData,
  selectKoulutus,
  selectLoading as selectKoulutusLoading,
} from '#/src/store/reducers/koulutusSlice';
import { useTranslation } from 'react-i18next';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import Murupolku from '#/src/components/common/Murupolku';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import { ToteutusHakuMuu } from './ToteutusHakuMuu';
import { ToteutusHakuEiSahkoista } from './ToteutusHakuEiSahkoista';

const useStyles = makeStyles((theme) => ({
  accordion: {
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  root: { marginTop: '100px' },
  textWithBackgroundBox: {
    backgroundColor: colors.beigeGreen,
    height: '24px',
  },
  textWithBackgroundText: {
    textAlign: 'center',
    verticalAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.black,
    margin: '0 10px',
    lineHeight: '24px',
  },
}));

const TextWithBackground = (props) => {
  const classes = useStyles();
  return (
    <Box
      className={classes.textWithBackgroundBox}
      display="flex"
      justifyContent="center"
      justifyItems="center">
      <div className={classes.textWithBackgroundText}>{props.children}</div>
    </Box>
  );
};

const AccordionWithTitle = ({ titleTranslation, data }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Box
      className={clsx([classes.accordion, classes.root])}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h2">{t(titleTranslation)}</Typography>
      <Spacer />
      <Accordion items={data} />
    </Box>
  );
};
const Toteutus = () => {
  const classes = useStyles();
  const { oid } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentLanguage = l.getLanguage();

  const toteutus = useSelector(selectToteutus(oid), shallowEqual);
  const koulutusOid = toteutus?.koulutusOid;
  const koulutus = useSelector(selectKoulutus(koulutusOid), shallowEqual);
  const jatkuvatHaut = useSelector(selectJatkuvatHaut(oid));
  const yhteisHaut = useSelector(selectYhteisHaut(oid));
  const erillisHaut = useSelector(selectErillisHaut(oid));
  const koulutusLoading = useSelector(selectKoulutusLoading);
  const toteutusLoading = useSelector(selectToteutusLoading);

  const loading = !koulutus || koulutusLoading || toteutusLoading;
  const asiasanat =
    toteutus?.metadata?.asiasanat
      .filter((asiasana) => asiasana.kieli === currentLanguage)
      .map((asiasana) => asiasana.arvo) ?? [];

  useEffect(() => {
    if (!toteutus) {
      dispatch(fetchToteutus(oid));
    }
    // TODO: Get rid of koulutus call here when opintolaajuus comes from toteutus -backend
    if (!koulutus && koulutusOid) {
      dispatch(fetchKoulutusWithRelatedData(toteutus.koulutusOid));
    }
  }, [toteutus, dispatch, oid, koulutus, koulutusOid]);

  const opetus = toteutus?.metadata?.opetus;

  return loading ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <Hidden smDown>
          <Box mt={5} ml={9} alignSelf="start">
            <Murupolku path={[{ name: l.localize(toteutus?.nimi) }]} />
          </Box>
        </Hidden>
        <Typography style={{ marginTop: '20px' }} variant="h1">
          {l.localize(toteutus?.nimi)}
        </Typography>
        <Grid
          className={classes.root}
          alignItems="center"
          justify="center"
          container
          spacing={1}>
          {asiasanat.map((asiasana, i) => (
            <Grid item key={i}>
              <TextWithBackground>{asiasana}</TextWithBackground>
            </Grid>
          ))}
        </Grid>
        <Box mt={7}>
          <TeemakuvaImage
            imgUrl={toteutus?.teemakuva}
            altText={t('toteutus.toteutuksen-teemakuva')}
          />
        </Box>
        <Box mt={4}>
          <ToteutusInfoGrid
            koulutusTyyppi={toteutus?.metadata?.tyyppi}
            nimikkeet={toteutus?.metadata?.ammattinimikkeet}
            kielet={opetus?.opetuskieli}
            laajuus={[koulutus?.opintojenLaajuus, koulutus?.opintojenLaajuusYksikkö]}
            aloitus={[
              opetus?.koulutuksenTarkkaAlkamisaika,
              opetus?.koulutuksenAlkamispaivamaara,
              opetus?.koulutuksenAlkamiskausi,
              opetus?.koulutuksenAlkamisvuosi,
            ]}
            suunniteltuKestoVuodet={opetus?.suunniteltuKestoVuodet}
            suunniteltuKestoKuukaudet={opetus?.suunniteltuKestoKuukaudet}
            opetusaika={opetus?.opetusaika}
            opetustapa={opetus?.opetustapa}
            maksullisuus={opetus?.onkoMaksullinen && opetus?.maksunMaara}
            apuraha={opetus?.onkoStipendia && opetus?.stipendinMaara}
          />
        </Box>
        {jatkuvatHaut?.length + yhteisHaut?.length + erillisHaut?.length > 0 && (
          <HakuKaynnissaCard
            title={t('toteutus.haku-kaynnisa')}
            text={t('toteutus.katso-hakukohteet')}
            link={
              <HashLink
                to="#haut"
                aria-label="anchor"
                smooth
                style={{ textDecoration: 'none' }}
              />
            }
            buttonText={t('toteutus.nayta-hakukohteet')}
          />
        )}
        {toteutus?.metadata?.kuvaus && (
          <HtmlTextBox
            heading={t('koulutus.kuvaus')}
            html={l.localize(toteutus.metadata.kuvaus)}
            className={classes.root}
          />
        )}
        {toteutus?.metadata?.osaamisalat && (
          <AccordionWithTitle
            titleTranslation="koulutus.osaamisalat"
            data={toteutus.metadata.osaamisalat.map((osaamisala) => ({
              title: l.localize(osaamisala.koodi.nimi),
              content: !isEmpty(osaamisala.linkki) && !isEmpty(osaamisala.otsikko) && (
                <LocalizedLink
                  target="_blank"
                  rel="noopener"
                  href={l.localize(osaamisala.linkki)}>
                  {l.localize(osaamisala.otsikko)}
                  <OpenInNewIcon />
                </LocalizedLink>
              ),
            }))}
          />
        )}
        {jatkuvatHaut?.length + yhteisHaut?.length + erillisHaut?.length > 0 && (
          <ToteutusHakukohteet
            jatkuvatHaut={jatkuvatHaut}
            yhteisHaut={yhteisHaut}
            erillisHaut={erillisHaut}
          />
        )}
        {toteutus?.hasMuuHaku && <ToteutusHakuMuu oid={toteutus?.oid} />}
        {toteutus?.hasEiSahkoistaHaku && <ToteutusHakuEiSahkoista oid={toteutus?.oid} />}
        {opetus?.lisatiedot.length > 0 && (
          <AccordionWithTitle
            titleTranslation="koulutus.lisätietoa"
            data={toteutus.metadata.opetus.lisatiedot.map((lisatieto) => ({
              title: l.localize(lisatieto.otsikko),
              content: l.localize(lisatieto.teksti),
            }))}
          />
        )}
        {toteutus?.metadata?.yhteyshenkilot.length > 0 && (
          <Box mt={12} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h2">{t('toteutus.yhteyshenkilot')}</Typography>
            <Spacer />
            <Box mt={5}>
              <Grid container alignItems="center">
                {toteutus.metadata.yhteyshenkilot.map((yhteyshenkilo, i, a) => (
                  <React.Fragment key={i}>
                    <Grid item>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography variant="h4">
                            {l.localize(yhteyshenkilo.nimi)}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1">
                            {l.localize(yhteyshenkilo.titteli)}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1">
                            {l.localize(yhteyshenkilo.sahkoposti)}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1">
                            {l.localize(yhteyshenkilo.puhelinnumero)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    {i + 1 !== a.length && (
                      <Grid item>
                        <Box
                          mx={9}
                          style={{ height: '104px' }}
                          borderRight={`1px solid ${colors.lightGrey}`}
                        />
                      </Grid>
                    )}
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </ContentWrapper>
  );
};

export default Toteutus;
