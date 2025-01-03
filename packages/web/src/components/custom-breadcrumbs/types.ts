// @mui
import { BreadcrumbsProps } from '@mui/material/Breadcrumbs';
import { ReactElement } from 'react';

// ----------------------------------------------------------------------

export type BreadcrumbsLinkProps = {
  name?: ReactElement;
  href?: string;
  icon?: React.ReactElement;
};

export interface CustomBreadcrumbsProps extends BreadcrumbsProps {
  heading?: ReactElement;
  moreLink?: string[];
  activeLast?: boolean;
  action?: React.ReactNode;
  links: BreadcrumbsLinkProps[];
}
