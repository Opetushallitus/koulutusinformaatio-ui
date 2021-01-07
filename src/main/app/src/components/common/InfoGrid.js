import React from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  Typography,
  Grid,
  IconButton,
  Paper,
  Icon,
  Box,
  Tooltip,
} from '@material-ui/core';
import { colors, educationTypeColorCode } from '#/src/colors';
import Spacer from './Spacer';
import KoulutusAsteIcon from '#/src/assets/images/koulutusaste.svg';
import KoulutusTyypitIcon from '#/src/assets/images/koulutustyyppi.svg';
import TutkintoNimikeIcon from '#/src/assets/images/tutkintonimike.svg';
import SuunniteltuKestoIcon from '#/src/assets/images/suunniteltu_kesto.svg';
import KoulutuksenLaajuusIcon from '#/src/assets/images/koulutuksen_laajuus.svg';
import TutkintoonHakeminenIcon from '#/src/assets/images/tutkintoon_hakeminen.svg';
import OpetusKasvatusPsykologiaIcon from '#/src/assets/images/opetus_kasvatus_psykologia.svg';
import ApurahaIcon from '#/src/assets/images/Apuraha.svg';

const iconLookupTable = {
  KoulutusAsteIcon: KoulutusAsteIcon,
  KoulutusTyypitIcon: KoulutusTyypitIcon,
  TutkintoNimikeIcon: TutkintoNimikeIcon,
  SuunniteltuKestoIcon: SuunniteltuKestoIcon,
  KoulutuksenLaajuusIcon: KoulutuksenLaajuusIcon,
  TutkintoonHakeminenIcon: TutkintoonHakeminenIcon,
  OpetusKasvatusPsykologiaIcon: OpetusKasvatusPsykologiaIcon,
  ApurahaIcon: ApurahaIcon,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '80%',
    backgroundColor: educationTypeColorCode.ammatillinenGreenBg, // TODO: Not sure if this should come from koulutus type theme
    [theme.breakpoints.down('sm')]: {
      width: '95%',
    },
  },
  text: {
    color: colors.black,
  },
  title: {
    fontWeight: 600,
  },
  grid: {
    width: '70%',
    paddingTop: '62px',
    paddingBottom: '62px',
  },
  bgColor: {
    backgroundColor: 'white',
    color: colors.black,
    padding: '15px',
  },
  arrow: {
    color: 'white',
  },
}));

const InfoGrid = (props) => {
  const { heading, gridData, className } = props;
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      className={className}>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      <Paper className={classes.paper}>
        <Grid
          className={classes.grid}
          container
          alignItems="flex-start"
          justify="space-evenly"
          spacing={5}>
          {gridData.map((e, index) => (
            <Grid
              item
              container
              spacing={1}
              xs={12}
              md={6}
              lg={4}
              key={`info-grid-${e.id}-${index}`}>
              <Grid item>
                {typeof e.icon === 'string' ? (
                  <Icon>
                    <img src={iconLookupTable[e.icon]} alt="" />
                  </Icon>
                ) : (
                  e.icon
                )}
              </Grid>
              <Grid
                item
                xs={10}
                spacing={1}
                alignContent="flex-start"
                container
                direction="column"
                wrap="nowrap">
                <Grid item container spacing={1} wrap="nowrap" alignItems="flex-start">
                  <Grid item>
                    <Typography
                      className={clsx(classes.title, classes.text)}
                      variant="body1"
                      noWrap
                      component="h3">
                      {e.title}
                    </Typography>
                  </Grid>
                  {e?.modalData?.text && (
                    <Grid item>
                      <Tooltip
                        classes={{ tooltip: classes.bgColor, arrow: classes.arrow }}
                        enterTouchDelay={0}
                        leaveTouchDelay={15000}
                        interactive
                        arrow
                        title={e?.modalData?.text}>
                        <IconButton style={{ padding: 0, minHeight: 0, minWidth: 0 }}>
                          {e?.modalData?.icon}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
                <Grid item>
                  {e.text.split('\n').map((line, i) => (
                    <Typography
                      className={classes.text}
                      component="div"
                      variant="body1"
                      key={i}>
                      {line}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default InfoGrid;
