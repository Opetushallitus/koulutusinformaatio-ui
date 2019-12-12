import React from 'react';
import clsx from 'clsx';
import { makeStyles, Typography, Grid, Paper, Icon } from '@material-ui/core';
import { colors } from '../../colors';
import Spacer from './Spacer';
import KoulutusAsteIcon from '../../assets/images/koulutusaste.svg';
import KoulutusTyypitIcon from '../../assets/images/koulutustyyppi.svg';
import TutkintoNimikeIcon from '../../assets/images/tutkintonimike.svg';
import SuunniteltuKestoIcon from '../../assets/images/suunniteltu_kesto.svg';
import KoulutuksenLaajuusIcon from '../../assets/images/koulutuksen_laajuus.svg';
import TutkintoonHakeminenIcon from '../../assets/images/tutkintoon_hakeminen.svg';
import OpetusKasvatusPsykologiaIcon from '../../assets/images/opetus_kasvatus_psykologia.svg';

const iconLookupTable = {
  KoulutusAsteIcon: KoulutusAsteIcon,
  KoulutusTyypitIcon: KoulutusTyypitIcon,
  TutkintoNimikeIcon: TutkintoNimikeIcon,
  SuunniteltuKestoIcon: SuunniteltuKestoIcon,
  KoulutuksenLaajuusIcon: KoulutuksenLaajuusIcon,
  TutkintoonHakeminenIcon: TutkintoonHakeminenIcon,
  OpetusKasvatusPsykologiaIcon: OpetusKasvatusPsykologiaIcon,
};

const useStyles = makeStyles({
  paper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '80%',
    backgroundColor: colors.limeGreenBackground,
  },
  text: {
    color: colors.black,
  },
  title: {
    fontWeight: 700,
  },
  grid: {
    width: '70%',
    paddingTop: '62px',
    paddingBottom: '62px',
  },
});

const InfoGrid = ({ heading, gridData, id }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      <Paper className={classes.paper}>
        <Grid
          className={classes.grid}
          container
          alignItems="flex-start"
          justify="space-evenly"
          spacing={5}
        >
          {gridData.map((e, index) => (
            <Grid
              item
              container
              spacing={1}
              xs={12}
              md={6}
              lg={4}
              key={`info-grid-${e.id}-${index}`}
            >
              <Grid item>
                <Icon>
                  <img src={iconLookupTable[e.icon]} alt="" />
                </Icon>
              </Grid>
              <Grid
                item
                xs={10}
                spacing={1}
                alignContent="flex-start"
                container
                direction="column"
              >
                <Typography
                  className={clsx(classes.title, classes.text)}
                  variant="body1"
                  component="h3"
                >
                  {e.title}
                </Typography>
                <Typography className={classes.text} variant="body1">
                  {e.text}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default InfoGrid;
