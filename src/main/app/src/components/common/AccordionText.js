import { colors } from '#/src/colors';
import { Collapse, makeStyles, Typography } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import React, { useState } from 'react';
import { sanitizedHTMLParser } from '#/src/tools/Utils';

const useStyles = makeStyles(() => ({
  heading: {
    fontWeight: 700,
    color: colors.brandGreen,
    cursor: 'pointer',
  },
  icon: {
    position: 'absolute',
  },
}));

export const AccordionText = ({ text, title }) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const handleChange = () => setIsOpen(!isOpen);

  return (
    <>
      <Typography
        className={classes.heading}
        onClick={handleChange}
        aria-expanded={isOpen}
        role={'button'}>
        {title}
        {isOpen ? (
          <ArrowDropUp className={classes.icon} />
        ) : (
          <ArrowDropDown className={classes.icon} />
        )}
      </Typography>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Typography variant="body1" component="div">
          {sanitizedHTMLParser(text)}
        </Typography>
      </Collapse>
    </>
  );
};
