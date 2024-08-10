import classNames from 'classnames';
import { ReactNode, useMemo } from 'react';
import { Link, useMatch } from 'react-router-dom';
import MenuIcon from '../NavigationBar/MenuIcon';

export type BootstrapNavLinkProps = {
  path: string;
  children: ReactNode;
  icon?: string;
};

export function BootstrapNavLink({ path, children, icon }: BootstrapNavLinkProps) {
  const pathOnly = useMemo(() => new URL(path, window.location.href).pathname, [path]);
  const pathOnlyMatch = useMatch(`${pathOnly.replace(/\/$/, '')}/*`);

  return (
    <li className="nav-item">
      <Link className={classNames('nav-link', { active: pathOnlyMatch })} to={path} role="presentation">
        {icon && <MenuIcon icon={icon} />}
        {children}
      </Link>
    </li>
  );
}
