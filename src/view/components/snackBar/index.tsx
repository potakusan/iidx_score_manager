import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import { amber, green } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles, Theme } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export interface Props {
  className?: string;
  message?: any;
  onClose?: () => void;
  variant: keyof typeof variantIcon;
  autoHideDuration?:number
  open?:boolean,
  handleClose?:()=>void
}

function SnackBarWrapper(props: Props) {
  const classes = styles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <Button onClick={onClose} color="inherit" size="small" key="ok">
          Ok
        </Button>,
      ]}
      {...other}
    />
  );
}

export default function ShowSnackBar(props:Props) {
  if(!props.open){
    return (null);
  }
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={props.open}
        autoHideDuration={props.autoHideDuration ? props.autoHideDuration : 2000}
        onClose={props.handleClose}
      >
        <SnackBarWrapper
          onClose={props.handleClose}
          variant={props.variant}
          message={props.message}
        />
      </Snackbar>
    </div>
  );
}
