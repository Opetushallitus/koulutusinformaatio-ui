import React, { useEffect, useState } from 'react';
import ContentWrapper from '../common/ContentWrapper';
import { Box, Typography, makeStyles, Grid } from '@material-ui/core';
import { HashLink } from 'react-router-hash-link';
import { colors } from '#/src/colors';
import { ToteutusInfoGrid } from './ToteutusInfoGrid';
import ToteutusHakukohteet from './ToteutusHakukohteet';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useQuery } from 'react-query';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Spacer from '#/src/components/common/Spacer';
import Accordion from '#/src/components/common/Accordion';
import { Localizer as l, sanitizedHTMLParser } from '#/src/tools/Utils';
import HakuKaynnissaCard from '#/src/components/koulutus/HakuKaynnissaCard';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import _ from 'lodash';
import {
  fetchToteutus,
  selectLoading as selectToteutusLoading,
  selectToteutus,
  selectHakukohteet,
} from '#/src/store/reducers/toteutusSlice';
import {
  fetchKoulutusWithRelatedData,
  selectKoulutus,
  selectLoading as selectKoulutusLoading,
} from '#/src/store/reducers/koulutusSlice';
import { getToteutusOsaamisalaKuvaus } from '#/src/api/konfoApi';
import { useTranslation } from 'react-i18next';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import Murupolku from '#/src/components/common/Murupolku';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
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

const getOsaamisalatPageData = async ({ ePerusteId, requestParams }) => {
  const osaamisalat = await getToteutusOsaamisalaKuvaus({ ePerusteId, requestParams });
  return { osaamisalat };
};

const useOsaamisalatPageData = ({ ePerusteId, requestParams }) => {
  return useQuery(
    ['getOsaamisalatPageData', { ePerusteId, requestParams }],
    (key, props) => getOsaamisalatPageData(props),
    {
      refetchOnWindowFocus: false,
      enabled: !_.isNil(ePerusteId) && !_.isEmpty(requestParams),
    }
  );
};
const Toteutus = () => {
  const classes = useStyles();
  const { oid } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentLanguage = l.getLanguage();

  // TODO: There is absolutely no error handling atm.
  const toteutus = useSelector(selectToteutus(oid), shallowEqual);
  const koulutusOid = toteutus?.koulutusOid;
  const koulutus = useSelector(selectKoulutus(koulutusOid), shallowEqual);
  const { jatkuvatHaut, yhteisHaut, erillisHaut } = useSelector(
    selectHakukohteet(oid),
    shallowEqual
  );
  const toteutusLoading = useSelector(selectToteutusLoading);
  const [koulutusNotFetched, setKoulutusNotFetched] = useState(!koulutus);
  const koulutusLoading =
    useSelector(selectKoulutusLoading) || (!koulutus && koulutusNotFetched);

  const loading = koulutusLoading || toteutusLoading;
  const asiasanat =
    toteutus?.metadata?.asiasanat
      .filter((asiasana) => asiasana.kieli === currentLanguage)
      .map((asiasana) => asiasana.arvo) ?? [];

  const { data = [], isFetching } = useOsaamisalatPageData({
    ePerusteId: koulutus?.ePerusteId?.toString(),
    requestParams: {
      'koodi-urit': toteutus?.metadata?.osaamisalat
        ?.map((oa) => oa?.koodi?.koodiUri)
        ?.join(','),
    },
  });

  const osaamisalatCombined = data?.osaamisalat?.map((oa) => {
    const toteutusOsaamisala = toteutus?.metadata?.osaamisalat?.find(
      (toa) => toa?.koodi?.koodiUri === oa?.osaamisalakoodiUri
    );
    return { ...oa, extended: toteutusOsaamisala };
  });

  useEffect(() => {
    if (!toteutus) {
      dispatch(fetchToteutus(oid));
    }
    // TODO: Get rid of koulutus call here when opintolaajuus comes from toteutus -backend
    if (!koulutus && koulutusOid && koulutusNotFetched) {
      dispatch(fetchKoulutusWithRelatedData(toteutus.koulutusOid));
      setKoulutusNotFetched(false);
    }
  }, [toteutus, dispatch, oid, koulutus, koulutusOid, koulutusNotFetched]);

  const opetus = toteutus?.metadata?.opetus;
  const hakuUrl = useSelector(getHakuUrl);

  return loading || isFetching ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <Box width="100%" alignSelf="start">
          <Murupolku
            path={[
              { name: t('haku.otsikko'), link: hakuUrl.url },
              {
                name: l.localize(koulutus?.tutkintoNimi),
                link: `/koulutus/${toteutus?.koulutusOid}`,
              },
              { name: l.localize(toteutus?.nimi) },
            ]}
          />
        </Box>
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
            opetuskieletKuvaus={opetus?.opetuskieletKuvaus}
            laajuus={[koulutus?.opintojenLaajuus, koulutus?.opintojenLaajuusYksikkö]}
            aloitus={[
              opetus?.koulutuksenTarkkaAlkamisaika,
              opetus?.koulutuksenAlkamispaivamaara,
              opetus?.koulutuksenAlkamiskausi,
              opetus?.koulutuksenAlkamisvuosi,
            ]}
            suunniteltuKestoVuodet={opetus?.suunniteltuKestoVuodet}
            suunniteltuKestoKuukaudet={opetus?.suunniteltuKestoKuukaudet}
            suunniteltuKestoKuvaus={opetus?.suunniteltuKestoKuvaus}
            opetusaika={opetus?.opetusaika}
            opetusaikaKuvaus={opetus?.opetusaikaKuvaus}
            opetustapa={opetus?.opetustapa}
            opetustapaKuvaus={opetus?.opetustapaKuvaus}
            maksullisuus={opetus?.onkoMaksullinen && opetus?.maksunMaara}
            maksullisuusKuvaus={opetus?.maksullisuusKuvaus}
            apuraha={opetus?.onkoStipendia && opetus?.stipendinMaara}
            apurahaKuvaus={opetus?.stipendinKuvaus}
          />
        </Box>
        {toteutus?.hakuAukiType && (
          <HakuKaynnissaCard
            title={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.haku-kaynnissa')
                : t('toteutus.ilmoittautuminen-kaynnissa')
            }
            text={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.katso-hakukohteet')
                : t('toteutus.katso-ilmoittautumisen-ohjeet')
            }
            link={
              <HashLink
                to="#haut"
                aria-label="anchor"
                smooth
                style={{ textDecoration: 'none' }}
              />
            }
            buttonText={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.nayta-hakukohteet')
                : t('toteutus.nayta-ohjeet')
            }
          />
        )}
        {toteutus?.metadata?.kuvaus && (
          <HtmlTextBox
            heading={t('koulutus.kuvaus')}
            html={l.localize(toteutus.metadata.kuvaus)}
            className={classes.root}
          />
        )}
        {!_.isEmpty(osaamisalatCombined) > 0 && (
          <AccordionWithTitle
            titleTranslation="koulutus.osaamisalat"
            data={osaamisalatCombined?.map((osaamisala) => ({
              title: l.localize(osaamisala),
              content: (
                <>
                  <Typography>
                    {sanitizedHTMLParser(l.localize(osaamisala?.kuvaus))}
                  </Typography>
                  {!_.isEmpty(osaamisala?.extended?.linkki) &&
                    !_.isEmpty(osaamisala?.extended?.otsikko) && (
                      <LocalizedLink
                        target="_blank"
                        rel="noopener"
                        href={l.localize(osaamisala?.extended?.linkki)}>
                        {l.localize(osaamisala?.extended?.otsikko)}
                        <OpenInNewIcon />
                      </LocalizedLink>
                    )}
                </>
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
