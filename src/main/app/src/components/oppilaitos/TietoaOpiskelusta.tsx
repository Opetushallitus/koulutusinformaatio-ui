import { Box, Container, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Spacer from '#/src/components/common/Spacer';
import { Localizer as l, sanitizedHTMLParser } from '#/src/tools/Utils';
import { Translateable } from '#/src/types/common';
import { Accordion } from '../common/Accordion';

type Props = {
  className: string;
  heading: string;
  tietoaOpiskelusta: Array<{
    otsikko: Translateable;
    teksti: Translateable;
  }>;
};

export const TietoaOpiskelusta = ({
  className,
  heading,
  tietoaOpiskelusta = [],
}: Props) => {
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
              content: sanitizedHTMLParser(l.localize(lisatieto.teksti)),
            }))}
          />
        </Container>
      ) : (
        <Typography variant="h6">{t('oppilaitos.ei-tietoa-opiskelusta')}</Typography>
      )}
    </Box>
  );
};
