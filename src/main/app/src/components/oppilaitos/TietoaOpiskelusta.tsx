import React from 'react';

import { Box, Container, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Spacer from '#/src/components/common/Spacer';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/Utils';
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
              title: localize(lisatieto.otsikko),
              content: sanitizedHTMLParser(localize(lisatieto.teksti)),
            }))}
          />
        </Container>
      ) : (
        <Typography variant="h6">{t('oppilaitos.ei-tietoa-opiskelusta')}</Typography>
      )}
    </Box>
  );
};
