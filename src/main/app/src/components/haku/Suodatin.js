import React, { useState } from 'react';
import { makeStyles, Typography, Box, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ExpandLessOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import PopoverWithArrow from '#/src/components/common/PopoverWithArrow';

const useStyles = makeStyles((theme) => ({
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

const Suodatin = ({ btnId, SuodatinComponent, header }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [anchor, setAnchor] = useState(null);

  const isOpen = Boolean(anchor);

  const ExpandIcon = ({ open }) =>
    open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />;

  const _btnId = isOpen ? btnId : undefined;

  function handleClick(e) {
    setAnchor(e.currentTarget);
  }

  function handleClose() {
    setAnchor(null);
  }

  return (
    <Box className={classes.item}>
      <Typography className={classes.header} variant="h5">
        {header}
      </Typography>
      <Button
        aria-describedby={_btnId}
        endIcon={<ExpandIcon open={isOpen} />}
        onClick={handleClick}
        className={classes.expandButton}
        aria-label={t('haku.valitse')}>
        {t('haku.valitse')}
      </Button>
      <PopoverWithArrow
        anchorEl={anchor}
        content={<SuodatinComponent expanded elevation={2} summaryHidden />}
        id={_btnId}
        marginTop={7}
        onClose={handleClose}
        open={isOpen}
      />
    </Box>
  );
};
export default Suodatin;
