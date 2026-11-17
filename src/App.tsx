/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { FrontPageSplash } from './components/FrontPageSplash';
import { ServicesPage } from './components/ServicesPage';

export default function App() {
  const [page, setPage] = useState<'welcome' | 'services'>('welcome');

  return (
    <AnimatePresence mode="wait">
      {page === 'welcome' ? (
        <FrontPageSplash key="welcome" onEnter={() => setPage('services')} />
      ) : (
        <ServicesPage key="services" onBackToWelcome={() => setPage('welcome')} />
      )}
    </AnimatePresence>
  );
}
