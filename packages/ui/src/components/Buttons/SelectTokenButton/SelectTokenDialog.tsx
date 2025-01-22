// @mui
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
//
import { ConfirmDialogProps } from '../../template/custom-dialog/types';
import { Trans } from '@/i18n';
import { Avatar, Box, InputAdornment, ListItemText, Stack, TextField, Typography } from '@mui/material';
import Iconify from '../../template/iconify';

// ----------------------------------------------------------------------

type Props = Omit<DialogProps, 'title' | 'content'> & {
  tokens: any[];
  userTokens: any[];
  content?: React.ReactNode;
  action: React.ReactNode;
  onClose: VoidFunction;
};

export const SelectTokenDialog = ({
  tokens,
  userTokens,
  action,
  open,
  onClose,
  ...other
}: Props) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{<Trans>Select a token</Trans>}</DialogTitle>
      <Button variant="outlined" color="inherit" onClick={onClose}>
        Cancel
      </Button>

      <DialogContent sx={{ typography: 'body2' }}>
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Search tokens"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* your tokens */}
        {userTokens && (
          <>
            <Typography variant="body2">Your tokens</Typography>
            {userTokens.map((token) => {
              return <TokenItem token={token} balance={token.balance} />;
            })}
          </>
        )}

        {/* fav tokens */}
        <Typography variant="body2">Tokens</Typography>

        {tokens.map((token) => {
          return <TokenItem token={token} />;
        })}
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type TokenItemProps = {
  token: Token;
  balance?: string;
};

function TokenItem({ token, balance = '' }: TokenItemProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        variant="rounded"
        alt={token.name}
        src={token.icon}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />

      <ListItemText
        primary={<Link sx={{ color: 'text.primary', typography: 'subtitle2' }}>{name}</Link>}
        secondary={
         

            <Box component="span" sx={{ color:'text.secondary' }}>
              {token.name}
            </Box>
          
        }
        primaryTypographyProps={{
          noWrap: true,
        }}
        secondaryTypographyProps={{
          mt: 0.5,
        }}
      />

      {balance &&  {fCurrencuy(balance)}}
    </Stack>
  );
}
