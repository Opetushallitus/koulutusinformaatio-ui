import React, { useRef, useState } from 'react';

import { makeStyles, Typography, Box, Button } from '@material-ui/core';
import { ExpandLessOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import PopoverWithArrow from '#/src/components/common/PopoverWithArrow';

const useStyles = makeStyles(() => ({
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

const Suodatin = ({ id: propsId, SuodatinComponent, header }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const anchorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const id = isOpen ? propsId : undefined;

  const ExpandIcon = () => (isOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />);

  return (
    <Box className={classes.item}>
      <Typography className={classes.header} variant="h5">
        {header}
      </Typography>
      <Button
        aria-describedby={id}
        endIcon={<ExpandIcon />}
        onClick={() => setIsOpen(true)}
        ref={anchorRef}
        className={classes.expandButton}
        aria-label={t('haku.valitse')}>
        {t('haku.valitse')}
      </Button>
      <PopoverWithArrow
        anchorEl={anchorRef.current}
        content={<SuodatinComponent expanded elevation={2} summaryHidden />}
        id={id}
        marginTop={7}
        onClose={() => setIsOpen(false)}
        open={isOpen}
      />
    </Box>
  );
};
export default Suodatin;
