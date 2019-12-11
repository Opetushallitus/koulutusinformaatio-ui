import React from 'react';
import { Grid } from '@material-ui/core';
import LinkCard from './LinkCard';

const LinkCardGrid = (props) => {
  return (
    <Grid container spacing={3} direction="column">
      {props.cards.map((card) => (
        <Grid item>
          <LinkCard text={card.text} icon={card.icon} />
        </Grid>
      ))}
    </Grid>
  );
};

export default LinkCardGrid;
