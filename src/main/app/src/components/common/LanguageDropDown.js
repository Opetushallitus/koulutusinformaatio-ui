import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  withStyles,
  InputBase,
  Box,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { colors } from '#/src/colors';
import LanguageIcon from '@material-ui/icons/Language';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useLocation, useHistory } from 'react-router-dom';

const CustomInput = withStyles((theme) => ({
  input: {
    position: 'relative',
    fontSize: 12,
    color: colors.white,
  },
}))(InputBase);

const iconComponent = (props) => {
  return (
    <ArrowDropDownIcon className={props.className} style={{ color: colors.white }} />
  );
};

const LanguageDropDown = () => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const handleChange = (event) => {
    const newLanguage = event.target.value;
    const newPath = location.pathname.replace(/\/(.*?)\//, `/${newLanguage}/`); // Replace first path index with new language selection
    history.push(newPath);
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <LanguageIcon style={{ fontSize: '20px' }} />
      <FormControl size="small" color="primary">
        <Select
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
          value={i18n.language}
          onChange={handleChange}
          variant="standard"
          renderValue={(value) => value.toUpperCase()}
          input={<CustomInput />}
          IconComponent={iconComponent}>
          <MenuItem value={'fi'}>{t('kielivalinta.suomi')}</MenuItem>
          <MenuItem value={'sv'}>{t('kielivalinta.ruotsi')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageDropDown;
