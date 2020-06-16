import React from 'react';
import { Container } from '@material-ui/core';
import { colors } from '#/src/colors';

const ContentWrapper = (props) => (
  <Container style={{ backgroundColor: colors.white, maxWidth: '1600px' }}>
    {props.children}
  </Container>
);

export default ContentWrapper;
