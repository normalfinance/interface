import { ApexOptions } from 'apexcharts';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
// utils
import { fNumber, fPercent } from 'src/utils/format-number';
// components
import Iconify from '@/components/template/iconify';
import Chart, { useChart } from '@/components/template/chart';
import Label from '@/components/template/label';

// ----------------------------------------------------------------------


interface Props extends CardProps {
    title: string;
    total: number;
    percent: number;
    chart: {
      colors?: string[];
      series: number[];
      options?: ApexOptions;
    };
    metadata: {
      label: string;
      percent: number;
      total: number;
    }[];
  }

/**
 * Pools Overview Component
 *
 * @component
 * @param {PoolsProps} props - The properties for the Pools component.
 */
const LiquidityPosition = ({
  title, total, percent, chart, metadata
}: Props) => {
    const theme = useTheme();

    const {
      colors = [theme.palette.primary.light, theme.palette.primary.main],
      series,
      options,
    } = chart;
  
    const chartOptions = useChart({
      colors: [colors[1]],
      fill: {
        type: 'gradient',
        gradient: {
          colorStops: [
            { offset: 0, color: colors[0] },
            { offset: 100, color: colors[1] },
          ],
        },
      },
      chart: {
        animations: {
          enabled: true,
        },
        sparkline: {
          enabled: true,
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          formatter: (value: number) => fNumber(value),
          title: {
            formatter: () => '',
          },
        },
        marker: {
          show: false,
        },
      },
      ...options,
    });
  
    const renderTrending = (
      
    );
  
    return (
      <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" paragraph>
            {title}
            {/* WMATIC / USDC */}
          </Typography>
  
          <Typography variant="subtitle2" paragraph>
            {inRange ? <Trans>Within range</Trans> : <Tran>Outside range</Tran>}
          </Typography>
  
          <Label variant="soft" color="info">
            v1
          </Label>
  
          <Label variant="soft" color="error">
            {fee}
            {/* 0.30% */}
          </Label>
  
          {/* <Typography variant="h3" gutterBottom>
            {fNumber(total)}
          </Typography> */}
  
          {metadata.map((item, index) => {
            <Stack  key={item.label} direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2, mb: 1 }}>
            {/* <Iconify
              icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
              sx={{
                mr: 1,
                p: 0.5,
                width: 24,
                height: 24,
                borderRadius: '50%',
                color: 'success.main',
                bgcolor: alpha(theme.palette.success.main, 0.16),
                ...(percent < 0 && {
                  color: 'error.main',
                  bgcolor: alpha(theme.palette.error.main, 0.16),
                }),
              }}
            /> */}
      
            <div>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {fNumber(item.total)}
              </Typography>
      
              <Typography variant="body2" sx={{ opacity: 0.72 }}>
                {item.label}
              </Typography>
            </div>
      
            {/* <Typography variant="subtitle2" component="div" noWrap>
              {percent > 0 && '+'}
      
              {fPercent(percent)}
      
              <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                {' than last week'}
              </Box>
            </Typography> */}
          </Stack>
          })}
        </Box>
  
        <Chart
          type="line"
          series={[{ data: series }]}
          options={chartOptions}
          width={96}
          height={64}
        />
      </Card>
    );

    };
    
    export { Pools };