import React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';


function SwitchSnack() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (key) => (
    <>
      <Button onClick={() => { closeSnackbar(key); }}>
        Dismiss
      </Button>
    </>
  );

  const handleClickVariant = (message, variant) => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      action,
      autoHideDuration: 10000,
    });
  };
  React.useEffect(() => {
    handleClickVariant('Use switch to see more metrics (i.e. personal statistics)', 'info');
  }, []);

  return (<div />);
}

export default function SwitchSnackBar() {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      maxSnack={8}
      style={{ width: 380, paddingTop: 60, zoom: '130%' }}
    >
      <SwitchSnack />
    </SnackbarProvider>
  );
}
