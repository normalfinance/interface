import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { Token } from '@/types/token';

export interface PickTokenProps {
  open: boolean;
  onClose: () => void;
  buttonSource: string;
  tokensList?: Token[];
  onTokenSelect: (token: Token) => void;
}

const PickToken: React.FC<PickTokenProps> = ({
  open,
  onClose,
  buttonSource,
  tokensList,
  onTokenSelect,
}) => {
  // For demonstration, we'll just select the first token when clicking on it.
  // In a real implementation, you'd render your token list with clickable items.
  const handleTokenClick = (token: Token) => {
    onTokenSelect(token);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pick Token - {buttonSource}</DialogTitle>
      <DialogContent>
        {tokensList && tokensList.length > 0 ? (
          tokensList.map((token) => (
            <Button key={token.shortname} onClick={() => handleTokenClick(token)}>
              <Typography>
                {token.name} ({token.shortname})
              </Typography>
            </Button>
          ))
        ) : (
          <Typography>No tokens available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PickToken;
