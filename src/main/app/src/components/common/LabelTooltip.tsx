import { Backdrop, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import React, { useState } from 'react';
import { colors } from '#/src/colors';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  backDrop: {
    zIndex: 999,
  },
  closeIcon: { position: 'absolute', top: '5px', right: '5px' },
  tooltip: {
    backgroundColor: colors.white,
    color: colors.black,
    paddingLeft: '16px',
    paddingRight: '35px', // Bigger to make space for close button
  },
  arrow: {
    color: colors.white,
  },
}));

type Props = { title: string };

export const LabelTooltip = ({ title }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((isOpen) => !isOpen);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Backdrop className={classes.backDrop} open={open} onClick={handleClose} />
      <Tooltip
        open={open}
        onClose={handleClose}
        PopperProps={{
          disablePortal: true,
        }}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        classes={{
          tooltip: classes.tooltip,
          arrow: classes.arrow,
        }}
        interactive
        arrow
        title={
          <>
            {title}
            <IconButton
              aria-label={t('sulje')}
              className={classes.closeIcon}
              style={{ padding: 0, minHeight: 0, minWidth: 0 }}
              onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </>
        }>
        <IconButton
          aria-label={t('nayta-lisatiedot')}
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
          onClick={handleClick}>
          <InfoOutlined />
        </IconButton>
      </Tooltip>
    </>
  );
};
