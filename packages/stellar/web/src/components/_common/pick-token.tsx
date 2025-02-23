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
}

const PickToken: React.FC<PickTokenProps> = ({ open, onClose, buttonSource, tokensList }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pick Token - {buttonSource}</DialogTitle>
      <DialogContent>
        <Typography>Hello, I am a token picker popup. (Opened by: {buttonSource})</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PickToken;
