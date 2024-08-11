import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PolkadotProvider } from '../contexts/PolkadotContext';
import { EnvironmentProvider } from '../contexts/EnvironmentContext';
import Header from '../components/layout/Header';
import '../public/css/daos.css';
import '../public/css/ideas.css';
import '../public/output.css';
import '../public/theme.css';

function MyApp({ Component, pageProps }) {
  return (
    <PolkadotProvider>
      <EnvironmentProvider>
        <Header />
        <Component {...pageProps} />
        <ToastContainer hideProgressBar={false} position="top-right" autoClose={3000} newestOnTop={false} closeOnClick rtl={false} draggable pauseOnHover theme="light" />
      </EnvironmentProvider>
    </PolkadotProvider>
  );
}

export default MyApp;
