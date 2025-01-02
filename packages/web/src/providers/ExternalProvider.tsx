'use client';

import { useEffect, useState } from 'react';

// Crisp
import { load as loadCrisp } from '../utils/crisp';

// StatusPage
import { load as loadStatuspage } from '../utils/statuspage';

type Props = {
  children: React.ReactNode;
};

export const ExternalProvider = ({ children }: Props) => {
  const [crisp, setCrisp] = useState(false);
  const [statuspage, setStatuspage] = useState(false);

  useEffect(() => {
    if (!crisp) {
      loadCrisp();
      setCrisp(true);
    }
  }, [crisp]);

  useEffect(() => {
    if (!statuspage) {
      loadStatuspage();
      setStatuspage(true);
    }
  }, [statuspage]);

  return children;
};
