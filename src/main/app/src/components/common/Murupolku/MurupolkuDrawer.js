import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { colors } from '#/src/colors';
import { MurupolkuFragment } from './MurupolkuFragment';

const useStyles = makeStyles((theme) => ({
  drawerToolbar: {
    color: colors.white,
    backgroundColor: theme.palette.primary.main,
  },
  drawer: {
    height: '100%',
    width: '100%',
  },
  drawerContainer: {
    overflowY: 'auto',
    padding: 0,
  },
  drawerItemWrapper: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${colors.lightGrey}`,
  },
}));

export const MurupolkuDrawer = ({ path, onClose, isOpen }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <SwipeableDrawer
      classes={{ paperAnchorBottom: classes.drawer }}
      anchor="bottom"
      onOpen={() => {}}
      onClose={onClose}
      open={isOpen}>
      <Box display="flex" flexDirection="column">
        <Toolbar variant="dense" disableGutters className={classes.drawerToolbar}>
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <Grid item>
              <IconButton color="inherit" onClick={onClose}>
                <Close />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="body1" noWrap color="inherit">
                {t('murupolku')}
              </Typography>
            </Grid>
            <Grid item />
          </Grid>
        </Toolbar>
        <Box className={classes.drawerContainer}>
          {path.map(({ name, link, isHome }, index) => (
            <Box className={classes.drawerItemWrapper}>
              <MurupolkuFragment
                name={name}
                link={link}
                closeDrawer={onClose}
                isHome={isHome}
                isLast={path.length - 1 === index}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};
