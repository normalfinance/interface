'use client';

import type { ButtonProps } from '@mui/material/Button';

import { usePrivy } from '@privy-io/react-auth';

import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }: ButtonProps) {
  const { ready, authenticated, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <Button disabled={disableLogin} onClick={login} variant="outlined" sx={sx} {...other}>
      Sign in
    </Button>
  );
}
