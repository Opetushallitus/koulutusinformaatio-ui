import React, { useEffect } from 'react';
import ContentWrapper from '../common/ContentWrapper';
import { Box, Typography, makeStyles, Grid, Link } from '@material-ui/core';
import { HashLink } from 'react-router-hash-link';
import { colors } from '#/src/colors';
import ToteutusInfoGrid from './ToteutusInfoGrid';
import ToteutusHakukohteet from './ToteutusHakukohteet';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import LoadingCircle from '#/src/components/common/LoadingCircle';
import Spacer from '#/src/components/common/Spacer';
import Accordion from '#/src/components/common/Accordion';
import { Localizer as l } from '#/src/tools/Utils';
import HakuKaynnissaCard from '#/src/components/koulutus/HakuKaynnissaCard';
import HeroImage from '#/src/components/common/HeroImage';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import _ from 'lodash';
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
import HtmlTextBox from '../common/HtmlTextBox';

const useStyles = makeStyles({
  accordion: { width: '50%' },
  root: { marginTop: '100px' },
  textWithBackgroundBox: {
    backgroundColor: '#CCFFCC',
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
});

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
  const toteutus = useSelector((state) => selectToteutus(state, oid), shallowEqual);
  const koulutusOid = toteutus?.koulutusOid;
  const currentLanguage = l.getLanguage();
  const koulutus = useSelector(
    (state) => selectKoulutus(state, koulutusOid),
    shallowEqual
  );
  const jatkuvatHaut = useSelector((state) => selectJatkuvatHaut(state, oid));
  const yhteisHaut = useSelector((state) => selectYhteisHaut(state, oid));
  const erillisHaut = useSelector((state) => selectErillisHaut(state, oid));
  const koulutusLoading = useSelector((state) => selectKoulutusLoading(state));
  const toteutusLoading = useSelector((state) => selectToteutusLoading(state));
  const loading = koulutusLoading || toteutusLoading;
  const asiasanat =
    toteutus?.metadata?.asiasanat
      .filter((asiasana) => asiasana.kieli === currentLanguage)
      .map((asiasana) => asiasana.arvo) || [];

  useEffect(() => {
    if (!toteutus) {
      dispatch(fetchToteutus(oid));
    }
    if (!koulutus && koulutusOid) {
      dispatch(fetchKoulutusWithRelatedData(toteutus.koulutusOid));
    }
  }, [toteutus, dispatch, oid, koulutus, koulutusOid]);
  return loading ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
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
          <HeroImage imgUrl={toteutus?.teemakuva} />
        </Box>
        <Box mt={4}>
          <ToteutusInfoGrid
            nimikkeet={toteutus?.metadata?.ammattinimikkeet}
            kielet={toteutus?.metadata?.opetus?.opetuskieli}
            laajuus={[koulutus?.opintojenLaajuus, koulutus?.opintojenLaajuusYksikkö]}
            aloitus={[
              toteutus?.metadata?.opetus?.koulutuksenTarkkaAlkamisaika,
              toteutus?.metadata?.opetus?.koulutuksenAlkamispaivamaara,
              toteutus?.metadata?.opetus?.koulutuksenAlkamiskausi,
              toteutus?.metadata?.opetus?.koulutuksenAlkamisvuosi,
            ]}
            opetusaika={toteutus?.metadata?.opetus?.opetusaika}
            opetustapa={toteutus?.metadata?.opetus?.opetustapa}
            maksullisuus={[
              toteutus?.metadata?.opetus?.onkoMaksullinen,
              toteutus?.metadata?.opetus?.maksunMaara,
            ]}
            apuraha={[
              toteutus?.metadata?.opetus?.onkoStipendia,
              toteutus?.metadata?.opetus?.stipendinMaara,
            ]}
          />
        </Box>
        {jatkuvatHaut?.length + yhteisHaut?.length + erillisHaut?.length > 0 ? (
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
        ) : null}
        {toteutus?.metadata?.kuvaus ? (
          <HtmlTextBox
            heading={t('koulutus.kuvaus')}
            html={l.localize(toteutus.metadata.kuvaus)}
            className={classes.root}
          />
        ) : null}
        {toteutus?.metadata?.osaamisalat ? (
          <AccordionWithTitle
            titleTranslation="koulutus.osaamisalat"
            data={toteutus.metadata.osaamisalat.map((osaamisala) => ({
              title: l.localize(osaamisala.koodi.nimi),
              content:
                !_.isEmpty(osaamisala.linkki) && !_.isEmpty(osaamisala.otsikko) ? (
                  <Link
                    target="_blank"
                    rel="noopener"
                    href={l.localize(osaamisala.linkki)}>
                    {l.localize(osaamisala.otsikko)}
                    <OpenInNewIcon />
                  </Link>
                ) : null,
            }))}
          />
        ) : null}
        {jatkuvatHaut?.length + yhteisHaut?.length + erillisHaut?.length > 0 ? (
          <ToteutusHakukohteet
            jatkuvatHaut={jatkuvatHaut}
            yhteisHaut={yhteisHaut}
            erillisHaut={erillisHaut}
          />
        ) : null}

        {toteutus?.metadata?.opetus?.lisatiedot.length > 0 ? (
          <AccordionWithTitle
            titleTranslation="koulutus.lisätietoa"
            data={toteutus.metadata.opetus.lisatiedot.map((lisatieto) => ({
              title: l.localize(lisatieto.otsikko),
              content: l.localize(lisatieto.teksti),
            }))}
          />
        ) : null}

        {toteutus?.metadata?.yhteyshenkilot.length > 0 ? (
          <Box mt={12} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h2">{t('toteutus.yhteyshenkilot')}</Typography>
            <Spacer />
            <Box mt={5}>
              <Grid container alignItems="center">
                {toteutus.metadata.yhteyshenkilot.map((yhteyshenkilo, i) => (
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
                    {i + 1 !== toteutus.metadata.yhteyshenkilot.length ? (
                      <Grid item>
                        <Box
                          mx={9}
                          style={{ height: '104px' }}
                          borderRight={`1px solid ${colors.lightGrey}`}
                        />
                      </Grid>
                    ) : null}
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </Box>
        ) : null}
      </Box>
    </ContentWrapper>
  );
};

export default observer(Toteutus);
