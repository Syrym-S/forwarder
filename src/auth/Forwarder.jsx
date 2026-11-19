import ForwarderRouter from './forwarder/router';
import AuthLocaleProvider from './i18n/AuthLocaleProvider';
import { CssBaseline } from '@mui/material';

export default function ForwarderApp() {
  return (
    <AuthLocaleProvider role="forwarder">
      <CssBaseline />
      <ForwarderRouter />
    </AuthLocaleProvider>
  );
}
