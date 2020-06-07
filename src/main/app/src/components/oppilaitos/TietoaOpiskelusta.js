import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Container } from '@material-ui/core';
import { Localizer as l } from '#/src/tools/Utils';
import Spacer from '#/src/components/common/Spacer';
import Accordion from '../common/Accordion';

const TietoaOpiskelusta = (props) => {
  const { className, heading, tietoaOpiskelusta = [] } = props;

  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      className={className}>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      {tietoaOpiskelusta.length > 0 ? (
        <Container maxWidth="md">
          <Accordion
            items={tietoaOpiskelusta.map((lisatieto) => ({
              title: l.localize(lisatieto.otsikko),
              content: l.localize(lisatieto.teksti),
            }))}
          />
        </Container>
      ) : (
        <Typography variant="h6">{t('oppilaitos.ei-tietoa-opiskelusta')}</Typography>
      )}
    </Box>
  );
};

export default TietoaOpiskelusta;
