import { Container } from '@mui/material';
import DashboardLayout from '@/layouts/dashboard/layout';

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <p>Home page</p>
      </Container>
    </DashboardLayout>
  );
}
