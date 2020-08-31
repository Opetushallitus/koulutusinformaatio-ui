import React, { useState } from 'react';
import { Divider, makeStyles, Typography, Box, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import KoulutusalaSuodatin from '#/src/components/hakutulos/hakutulosSuodattimet/KoulutusalaSuodatin';
import OpetuskieliSuodatin from '#/src/components/hakutulos/hakutulosSuodattimet/OpetusKieliSuodatin';
import SijaintiSuodatin from '#/src/components/hakutulos/hakutulosSuodattimet/SijaintiSuodatin';
import KoulutustyyppiSuodatin from '#/src/components/hakutulos/hakutulosSuodattimet/KoulutusTyyppiSuodatin';
import PopoverWithArrow from '#/src/components/common/PopoverWithArrow';
import { ExpandLessOutlined, ExpandMoreOutlined } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  container: {
    padding: '10px',
  },
  item: {
    padding: '10px 25px 5px 25px',
  },
  header: {
    paddingLeft: '8px',
  },
  expandButton: {
    height: '40px',
    fontFamily: 'Open Sans',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '16px',
    textAlign: 'center',
  },
}));

const HakupalkkiFilters = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [opetuskieletAnchor, setOpetuskieletAnchor] = useState(null);
  const [koulutustyyppiAnchor, setKoulutustyyppiAnchor] = useState(null);
  const [koulutusalaAnchor, setKoulutusalaAnchor] = useState(null);
  const [sijaintiAnchor, setSijaintiAnchor] = useState(null);

  const opetusKieletOpen = Boolean(opetuskieletAnchor);
  const koulutustyyppiOpen = Boolean(koulutustyyppiAnchor);
  const koulutusalaOpen = Boolean(koulutusalaAnchor);
  const sijaintiOpen = Boolean(sijaintiAnchor);

  const ExpandIcon = ({ open }) =>
    open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />;

  const opetuskieletBtnId = opetusKieletOpen ? 'opetuskieli-popover' : undefined;
  const koulutustyyppiBtnId = koulutustyyppiOpen ? 'koulutustyyppi-popover' : undefined;
  const koulutusalaBtnId = koulutusalaOpen ? 'koulutusala-popover' : undefined;
  const sijaintiBtnId = sijaintiOpen ? 'sijainti-popover' : undefined;

  function handleOpetuskieletClick(e) {
    setOpetuskieletAnchor(e.currentTarget);
  }
  function handleKoulutustyyppiClick(e) {
    setKoulutustyyppiAnchor(e.currentTarget);
  }
  function handleKoulutusalaClick(e) {
    setKoulutusalaAnchor(e.currentTarget);
  }
  function handleSijaintiClick(e) {
    setSijaintiAnchor(e.currentTarget);
  }

  function handleOpetuskieletClose() {
    setOpetuskieletAnchor(null);
  }
  function handleKoulutustyyppiClose() {
    setKoulutustyyppiAnchor(null);
  }
  function handleKoulutusalaClose() {
    setKoulutusalaAnchor(null);
  }
  function handleSijaintiClose() {
    setSijaintiAnchor(null);
  }

  return (
    <Box display="flex" justifyContent="center" className={classes.container}>
      <Box className={classes.item}>
        <Typography className={classes.header} variant="h5">
          {t('haku.kategoria')}
        </Typography>
        <Button
          aria-describedby={koulutusalaBtnId}
          endIcon={<ExpandIcon open={koulutusalaOpen} />}
          onClick={handleKoulutusalaClick}
          className={classes.expandButton}
          aria-label="Valitse">
          {t('haku.valitse')}
        </Button>
        <PopoverWithArrow
          anchorEl={koulutusalaAnchor}
          content={<KoulutusalaSuodatin expanded elevation={2} summaryHidden />}
          id={koulutusalaBtnId}
          marginTop={7}
          onClose={handleKoulutusalaClose}
          open={koulutusalaOpen}
        />
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box className={classes.item}>
        <Typography className={classes.header} variant="h5">
          {t('haku.koulutustyyppi')}
        </Typography>
        <Button
          aria-describedby={koulutustyyppiBtnId}
          endIcon={<ExpandIcon open={koulutustyyppiOpen} />}
          onClick={handleKoulutustyyppiClick}
          className={classes.expandButton}
          aria-label="Valitse">
          {t('haku.valitse')}
        </Button>
        <PopoverWithArrow
          id={koulutustyyppiBtnId}
          open={koulutustyyppiOpen}
          anchorEl={koulutustyyppiAnchor}
          marginTop={7}
          onClose={handleKoulutustyyppiClose}
          content={<KoulutustyyppiSuodatin expanded elevation={2} summaryHidden />}
        />
      </Box>
      <Divider orientation="vertical" flexItem />

      <Box className={classes.item}>
        <Typography className={classes.header} variant="h5">
          {t('haku.opetuskieli')}
        </Typography>
        <Button
          aria-describedby={opetuskieletBtnId}
          endIcon={<ExpandIcon open={opetusKieletOpen} />}
          onClick={handleOpetuskieletClick}
          className={classes.expandButton}
          aria-label="Valitse">
          {t('haku.valitse')}
        </Button>
        <PopoverWithArrow
          id={opetuskieletBtnId}
          open={opetusKieletOpen}
          anchorEl={opetuskieletAnchor}
          marginTop={7}
          onClose={handleOpetuskieletClose}
          content={<OpetuskieliSuodatin expanded elevation={2} summaryHidden />}
        />
      </Box>
      <Divider orientation="vertical" flexItem />

      <Box className={classes.item}>
        <Typography className={classes.header} variant="h5">
          {t('haku.sijainti')}
        </Typography>
        <Button
          aria-describedby={sijaintiBtnId}
          endIcon={<ExpandIcon open={sijaintiOpen} />}
          onClick={handleSijaintiClick}
          className={classes.expandButton}
          aria-label="Valitse">
          {t('haku.valitse')}
        </Button>
        <PopoverWithArrow
          id={sijaintiBtnId}
          open={sijaintiOpen}
          anchorEl={sijaintiAnchor}
          marginTop={7}
          onClose={handleSijaintiClose}
          content={<SijaintiSuodatin expanded elevation={2} summaryHidden />}
        />
      </Box>
    </Box>
  );
};
export default HakupalkkiFilters;
