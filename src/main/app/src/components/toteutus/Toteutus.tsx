import React, { useEffect, useMemo, useState } from 'react';

import { Box, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import clsx from 'clsx';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { getToteutusOsaamisalaKuvaus } from '#/src/api/konfoApi';
import { colors } from '#/src/colors';
import { Accordion } from '#/src/components/common/Accordion';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import Murupolku from '#/src/components/common/Murupolku';
import Spacer from '#/src/components/common/Spacer';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import { useUrlParams } from '#/src/components/hakutulos/UseUrlParams';
import { getHakuParams, getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  fetchKoulutusWithRelatedData,
  selectKoulutus,
  selectLoading as selectKoulutusLoading,
} from '#/src/store/reducers/koulutusSlice';
import {
  fetchToteutus,
  selectHakukohteet,
  selectLoading as selectToteutusLoading,
  selectToteutus,
} from '#/src/store/reducers/toteutusSlice';
import {
  getLocalizedOpintojenLaajuus,
  Localizer as l,
  sanitizedHTMLParser,
} from '#/src/tools/Utils';
import { Toteutus } from '#/src/types/ToteutusTypes';

import ContentWrapper from '../common/ContentWrapper';
import { useOppilaitokset } from '../oppilaitos/hooks';
import { Yhteystiedot } from '../oppilaitos/Yhteystiedot';
import { HakuKaynnissaCard } from './HakuKaynnissaCard';
import { ToteutusHakuEiSahkoista } from './ToteutusHakuEiSahkoista';
import { ToteutusHakukohteet } from './ToteutusHakukohteet';
import { ToteutusHakuMuu } from './ToteutusHakuMuu';
import { ToteutusInfoGrid } from './ToteutusInfoGrid';

const useStyles = makeStyles((theme) => ({
  accordion: {
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  root: { marginTop: '100px' },
  textWithBackgroundBox: {
    backgroundColor: colors.lightGreen2,
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

const TextWithBackground = (props: React.PropsWithChildren<object>) => {
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

type AccordionProps = {
  titleTranslationKey: string;
  data: React.ComponentProps<typeof Accordion>['items'];
};

const AccordionWithTitle = ({ titleTranslationKey, data }: AccordionProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Box
      className={clsx([classes.accordion, classes.root])}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h2">{t(titleTranslationKey)}</Typography>
      <Spacer />
      <Accordion
        items={data}
        ContentWrapper={({ children }) => (
          <Typography component="div">{children}</Typography>
        )}
      />
    </Box>
  );
};

type OsaamisalatProps = {
  ePerusteId: string;
  requestParams: { 'koodi-urit': string };
};

const getOsaamisalatPageData = async ({
  ePerusteId,
  requestParams,
}: OsaamisalatProps) => {
  const osaamisalat: Array<any> = await getToteutusOsaamisalaKuvaus({
    ePerusteId,
    requestParams,
  });
  return { osaamisalat };
};

const useOsaamisalatPageData = ({ ePerusteId, requestParams }: OsaamisalatProps) => {
  return useQuery(
    ['getOsaamisalatPageData', { ePerusteId, requestParams }],
    () => getOsaamisalatPageData({ ePerusteId, requestParams }),
    {
      enabled: !_.isNil(ePerusteId) && !_.isEmpty(requestParams),
    }
  );
};

// NOTE: In most cases there is only one oppilaitos per KOMOTO but there is no limit in data model
const ToteutuksenYhteystiedot = ({ oids }: { oids: Array<string> }) => {
  const { t } = useTranslation();
  const oppilaitokset = useOppilaitokset({
    isOppilaitosOsa: false,
    oids,
  });
  const filtered = useMemo(
    () => oppilaitokset.filter((v) => v.data.metadata?.yhteystiedot).map((v) => v.data),
    [oppilaitokset]
  );

  return (
    <Box mt={8} width="100%" display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h2">{t('toteutus.yhteystiedot')}</Typography>
      <Spacer />
      {filtered?.map((oppilaitos: any) => (
        <Yhteystiedot
          key={oppilaitos.oid}
          logo={oppilaitos.logo}
          yhteystiedot={oppilaitos.metadata.yhteystiedot}
          nimi={l.localize(oppilaitos)}
        />
      ))}
    </Box>
  );
};

export const ToteutusPage = () => {
  const classes = useStyles();
  const { oid } = useParams<{ oid: string }>();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentLanguage = l.getLanguage();
  const { isDraft } = useUrlParams();

  // TODO: There is absolutely no error handling atm.
  const toteutus: Toteutus = useSelector(selectToteutus(oid), shallowEqual);
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

  // NOTE: These ammattinimikkeet should be the freely written virkailija asiasana-ammattinimikkeet,
  // not the formal tutkintonimikkeet
  const asiasanat: Array<string> = (toteutus?.metadata?.ammattinimikkeet || [])
    .concat(toteutus?.metadata?.asiasanat || [])
    .filter((asiasana: any) => asiasana.kieli === currentLanguage)
    .map((asiasana: any) => asiasana.arvo);

  const { data: osaamisalaData = {} as any, isFetching } = useOsaamisalatPageData({
    ePerusteId: koulutus?.ePerusteId?.toString(),
    requestParams: {
      'koodi-urit': toteutus?.metadata?.osaamisalat
        ?.map((oa: any) => oa?.koodi?.koodiUri)
        ?.join(','),
    },
  });

  // NOTE: This must *not* handle alemmanKorkeakoulututkinnonOsaamisalat or ylemmanKorkeakoulututkinnonOsaamisalat
  const osaamisalatCombined = toteutus?.metadata?.osaamisalat?.map((toa: any) => {
    const extendedData =
      osaamisalaData?.osaamisalat?.find(
        (koa: any) => toa?.koodi?.koodiUri === koa?.osaamisalakoodiUri
      ) || {};
    const kuvaus = !_.isEmpty(extendedData?.kuvaus)
      ? l.localize(extendedData?.kuvaus)
      : `<p>${t('toteutus.osaamisalalle-ei-loytynyt-kuvausta')}</p>`;
    return { ...toa, extendedData, kuvaus };
  });

  const loading = koulutusLoading || toteutusLoading || isFetching;

  useEffect(() => {
    if (!toteutus) {
      dispatch(fetchToteutus(oid, isDraft));
    }
    // TODO: Get rid of koulutus call here when opintolaajuus AND tutkintonimikkeet comes from toteutus -backend
    if (!koulutus && koulutusOid && koulutusNotFetched) {
      dispatch(fetchKoulutusWithRelatedData(toteutus.koulutusOid, isDraft));
      setKoulutusNotFetched(false);
    }
  }, [isDraft, toteutus, dispatch, oid, koulutus, koulutusOid, koulutusNotFetched]);

  const opetus = toteutus?.metadata?.opetus;
  const hasAnyHaku = jatkuvatHaut?.length + yhteisHaut?.length + erillisHaut?.length > 0;
  const hakuUrl = useSelector(getHakuUrl);
  const { hakuParamsStr } = useSelector(getHakuParams);

  const combinedLisatiedot = useMemo(
    () => [...(koulutus?.lisatiedot || []), ...(opetus?.lisatiedot || [])],
    [koulutus?.lisatiedot, opetus?.lisatiedot]
  );

  return loading ? (
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
                link: `/koulutus/${toteutus?.koulutusOid}?${hakuParamsStr}`,
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
            laajuus={getLocalizedOpintojenLaajuus(koulutus)}
            opetus={opetus}
            hasHaku={hasAnyHaku}
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
        {!_.isEmpty(osaamisalatCombined) && (
          <AccordionWithTitle
            titleTranslationKey="koulutus.osaamisalat"
            data={osaamisalatCombined?.map((osaamisala: any) => ({
              title: l.localize(osaamisala?.koodi),
              content: (
                <>
                  {sanitizedHTMLParser(osaamisala?.kuvaus)}
                  {!_.isEmpty(osaamisala?.linkki) && !_.isEmpty(osaamisala?.otsikko) && (
                    <LocalizedLink
                      target="_blank"
                      rel="noopener"
                      to={l.localize(osaamisala?.linkki)}>
                      {l.localize(osaamisala?.otsikko)}
                      <OpenInNewIcon fontSize="small" />
                    </LocalizedLink>
                  )}
                </>
              ),
            }))}
          />
        )}
        {hasAnyHaku && (
          <ToteutusHakukohteet
            jatkuvatHaut={jatkuvatHaut}
            yhteisHaut={yhteisHaut}
            erillisHaut={erillisHaut}
          />
        )}
        {toteutus?.hasMuuHaku && <ToteutusHakuMuu oid={toteutus?.oid} />}
        {toteutus?.hasEiSahkoistaHaku && <ToteutusHakuEiSahkoista oid={toteutus?.oid} />}
        {combinedLisatiedot.length > 0 && (
          <AccordionWithTitle
            titleTranslationKey="koulutus.lisätietoa"
            data={combinedLisatiedot.map((lisatieto) => ({
              title: l.localize(lisatieto.otsikko),
              content: sanitizedHTMLParser(l.localize(lisatieto.teksti)),
            }))}
          />
        )}
        {toteutus?.metadata?.yhteyshenkilot.length > 0 && (
          <Box mt={12} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h2">{t('toteutus.yhteyshenkilot')}</Typography>
            <Spacer />
            <Box mt={5}>
              <Grid container alignItems="center">
                {toteutus.metadata.yhteyshenkilot.map(
                  (yhteyshenkilo: any, i: number, a: any) => (
                    <React.Fragment key={i}>
                      <Grid item>
                        <Grid container direction="column">
                          <Grid item>
                            <Typography variant="h5">
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
                          {yhteyshenkilo.wwwSivu && (
                            <Grid item>
                              <Link
                                target="_blank"
                                rel="noopener"
                                href={l.localize(yhteyshenkilo.wwwSivu)}
                                variant="body1">
                                <Grid container direction="row" alignItems="center">
                                  {l.localize(yhteyshenkilo.wwwSivu)}
                                  <OpenInNewIcon
                                    fontSize="small"
                                    style={{ marginLeft: '5px' }}
                                  />
                                </Grid>
                              </Link>
                            </Grid>
                          )}
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
                  )
                )}
              </Grid>
            </Box>
          </Box>
        )}
        {toteutus.oppilaitokset?.length > 0 && (
          <ToteutuksenYhteystiedot oids={toteutus.oppilaitokset} />
        )}
      </Box>
    </ContentWrapper>
  );
};
