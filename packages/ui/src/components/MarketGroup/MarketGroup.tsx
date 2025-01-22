import orderBy from 'lodash/orderBy';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
// utils
// components
import Iconify from 'src/components/iconify';
import { ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  markets: SynthMarket[];
}

export default function MarketGroup({ title, subheader, markets, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {orderBy(markets, ['totalFavorites'], ['desc']).map((market) => (
          <MarketItem key={market.id} market={market} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type AuthorItemProps = {
  market: SynthMarket;
};

function MarketItem({ market }: AuthorItemProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt={market.name} src={market.icon} />

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{market.name}</Typography>
      </Box>

      <ListItemText
        primary={<Link sx={{ color: 'text.primary', typography: 'subtitle2' }}>{name}</Link>}
        secondary={
          <>
            <Box component="span" sx={{ color: priceSale ? 'error.main' : 'text.secondary' }}>
              {fCurrency(price)}
            </Box>
          </>
        }
        primaryTypographyProps={{
          noWrap: true,
        }}
        secondaryTypographyProps={{
          mt: 0.5,
        }}
      />

      <Iconify
        icon="solar:cup-star-bold"
        sx={{
          p: 1,
          width: 40,
          height: 40,
          borderRadius: '50%',
        }}
      />
    </Stack>
  );
}
