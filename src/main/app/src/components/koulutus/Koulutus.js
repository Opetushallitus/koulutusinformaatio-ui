import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '#/src/hooks';
import { Link as MuiLink, Typography, Box, makeStyles, Hidden } from '@material-ui/core';
import { Localizer as l } from '#/src/tools/Utils';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import KoulutusInfoGrid from './KoulutusInfoGrid';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import ToteutusList from './ToteutusList';
import TulevaJarjestajaList from './TulevaJarjestajaList';
import SuositusKoulutusList from './SuositusKoulutusList';
import ContentWrapper from '#/src/components/common/ContentWrapper';
import Murupolku from '#/src/components/common/Murupolku';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
  fetchKoulutusWithRelatedData,
  selectKoulutus,
  selectSuositellutKoulutukset,
  selectLoading,
  selectJarjestajat,
  selectTulevatJarjestajat,
} from '#/src/store/reducers/koulutusSlice';
import LoadingCircle from '#/src/components/common/LoadingCircle';
import qs from 'query-string';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import clsx from 'clsx';
import Spacer from '#/src/components/common/Spacer';
import Accordion from '#/src/components/common/Accordion';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles((theme) => ({
  root: { marginTop: '100px' },
  lisatietoa: { width: '50%' },
  alatText: {
    ...theme.typography.body1,
    fontSize: '1.25rem',
  },
  accordion: {
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

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

const Koulutus = (props) => {
  const { urlStore } = useStores();
  const history = useHistory();
  const { draft } = qs.parse(history.location.search);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { oid } = useParams();
  const { hakuStore } = useStores();
  const { t } = useTranslation();
  const koulutus = useSelector(selectKoulutus(oid), shallowEqual);
  const suositellutKoulutukset = useSelector(
    (state) => selectSuositellutKoulutukset(state),
    shallowEqual
  );
  const toteutukset = useSelector(selectJarjestajat(oid));
  const tulevatJarjestajat = useSelector((state) => selectTulevatJarjestajat(state, oid));
  const loading = useSelector((state) => selectLoading(state));
  useEffect(() => {
    if (!koulutus) {
      dispatch(fetchKoulutusWithRelatedData(oid, draft));
    }
  }, [dispatch, koulutus, oid, draft]);

  const getKuvausHtmlSection = (captionKey, localizableText) => {
    return localizableText
      ? '<h3>' + t(captionKey) + '</h3>' + l.localize(localizableText)
      : '';
  };

  const createKoulutusHtml = () => {
    if (koulutus?.suorittaneenOsaaminen || koulutus?.tyotehtavatJoissaVoiToimia) {
      return (
        getKuvausHtmlSection(
          'koulutus.suorittaneenOsaaminen',
          koulutus?.suorittaneenOsaaminen
        ) +
        getKuvausHtmlSection(
          'koulutus.tyotehtavatJoissaVoiToimia',
          koulutus?.tyotehtavatJoissaVoiToimia
        )
      );
    } else {
      return l.localize(koulutus?.kuvaus);
    }
  };

  const createTutkinnonOsaHtml = (tutkinnonOsa) => {
    return (
      getKuvausHtmlSection(
        'koulutus.ammattitaitovaatimukset',
        tutkinnonOsa.ammattitaitovaatimukset
      ) +
      getKuvausHtmlSection(
        'koulutus.ammattitaidonOsoitamistavat',
        tutkinnonOsa.ammattitaidonOsoittamistavat
      )
    );
  };
  const findEperuste = (koulutus) => (id) => {
    return _.first(koulutus.eperusteet.filter((e) => e.id.toString() === id));
  };
  const findTutkinnonOsa = (eperuste) => (id) => {
    return _.first(eperuste.tutkinnonOsat.filter((t) => t.id.toString() === id));
  };

  const findTutkinnonOsaViitteet = (eperuste) => (id) => {
    return _.first(
      eperuste.suoritustavat.flatMap((t) =>
        t.tutkinnonOsaViitteet.filter((tv) => tv.id.toString() === id)
      )
    );
  };

  return loading ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Hidden smDown>
          <Box mt={5} ml={9} alignSelf="start">
            <Murupolku
              path={[
                { name: t('koulutus.hakutulos'), link: hakuStore.createHakuUrl },
                { name: l.localize(koulutus?.tutkintoNimi) },
              ]}
            />
          </Box>
        </Hidden>
        <Box mt={4}>
          {koulutus?.koulutusAla?.map((ala) => (
            <Typography
              key={ala.koodiUri}
              className={classes.alatText}
              variant="h3"
              component="h1">
              {l.localize(ala)}
            </Typography>
          ))}
        </Box>
        <Box mt={1}>
          <Typography variant="h1" component="h2">
            {l.localize(koulutus?.tutkintoNimi)}
          </Typography>
        </Box>
        <Box mt={7.5}>
          <TeemakuvaImage
            imgUrl={koulutus?.teemakuva}
            altText={t('koulutus.koulutuksen-teemakuva')}
          />
        </Box>
        <KoulutusInfoGrid
          className={classes.root}
          nimikkeet={koulutus?.tutkintoNimikkeet}
          koulutustyyppi={koulutus?.koulutusTyyppi}
          laajuus={[koulutus?.opintojenLaajuus, koulutus?.opintojenLaajuusYksikkö]}
        />
        {!_.isEmpty(koulutus?.kuvaus) ||
        koulutus?.suorittaneenOsaaminen ||
        koulutus?.tyotehtavatJoissaVoiToimia ? (
          <HtmlTextBox
            heading={t('koulutus.kuvaus')}
            html={createKoulutusHtml()}
            className={classes.root}
          />
        ) : null}
        {koulutus?.tutkinnonOsat ? (
          <AccordionWithTitle
            titleTranslation="koulutus.kuvaus"
            data={koulutus?.tutkinnonOsat.map(
              ({ tutkinnonosaId, tutkinnonosaViite, eperusteId }) => {
                const eperuste = findEperuste(koulutus)(eperusteId);
                const tutkinnonOsa = findTutkinnonOsa(eperuste)(tutkinnonosaId);
                const tutkinnonOsaViite = findTutkinnonOsaViitteet(eperuste)(
                  tutkinnonosaViite
                );
                return {
                  title: `${l.localize(tutkinnonOsa.nimi)}, ${
                    tutkinnonOsaViite.laajuus
                  } osp`,
                  content: (
                    <>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: createTutkinnonOsaHtml(tutkinnonOsa),
                        }}
                      />
                      <MuiLink
                        target="_blank"
                        rel="noopener"
                        href={urlStore.urls.url(
                          'eperusteet-service.eperuste.kuvaus',
                          l.getLanguage(),
                          eperusteId,
                          tutkinnonosaViite
                        )}>
                        {t('koulutus.eperuste-linkki')}
                        <OpenInNewIcon />
                      </MuiLink>
                    </>
                  ),
                };
              }
            )}
          />
        ) : null}
        <Box width="95%" id="tarjonta">
          <ToteutusList toteutukset={toteutukset} />
        </Box>
        {suositellutKoulutukset?.total > 0 && (
          <Box id="suositukset">
            <SuositusKoulutusList koulutukset={suositellutKoulutukset} oid={oid} />
          </Box>
        )}
        {tulevatJarjestajat?.length > 0 && (
          <Box width="95%" id="tulevatJarjestajat">
            <TulevaJarjestajaList jarjestajat={tulevatJarjestajat} />
          </Box>
        )}
      </Box>
    </ContentWrapper>
  );
};

export default observer(Koulutus);
