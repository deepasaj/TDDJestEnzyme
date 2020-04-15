import React from 'react';
import Button from '@material-ui/core/Button';

export const showNotification = (message, variant, show, close) => {
  show(message, {
    variant,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right',
    },
    persist: true,
    action: (key) => (
      <>
        <Button
          onClick={() => {
            close(key);
          }}
        >
          Dismiss
        </Button>
      </>
    ),
  });
};
