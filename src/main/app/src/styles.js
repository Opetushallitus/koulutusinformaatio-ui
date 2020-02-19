import { createStyles } from '@material-ui/core/styles';
import { sideMenuStyles } from './sideMenuStyles';

export const styles = (theme) =>
  createStyles({
    ...sideMenuStyles(theme),
    root: {
      display: 'flex',
    },
  });
