import classNames from 'classnames';
import { ReactNode, useMemo } from 'react';
import { Link, NavLink, NavLinkProps, To, useMatch } from 'react-router';
import MenuIcon from '../NavigationBar/MenuIcon';

export type BootstrapNavLinkProps = {
  active: boolean;
  to: To;
  children: ReactNode;
  icon?: string;
};

export function BootstrapNavLink({ active, to, children, icon }: BootstrapNavLinkProps) {
  return (
    <li className="nav-item">
      <Link className={classNames('nav-link', { active })} to={to} role="presentation">
        {icon && <MenuIcon icon={icon} />}
        {children}
      </Link>
    </li>
  );
}

export type BootstrapRRNavLinkProps = NavLinkProps & {
  icon?: string;
};

export function BootstrapRRNavLink({ children, icon, ...otherProps }: BootstrapRRNavLinkProps) {
  return (
    <li className="nav-item">
      <NavLink
        className={({ isActive }) => classNames('nav-link', { active: isActive })}
        role="presentation"
        {...otherProps}
      >
        {(...renderPropArgs) => (
          <>
            {icon && <MenuIcon icon={icon} />}
            {typeof children === 'function' ? children(...renderPropArgs) : children}
          </>
        )}
      </NavLink>
    </li>
  );
}

export type RouteActivatedBootstrapNavLinkProps = Omit<BootstrapNavLinkProps, 'active' | 'to'> & {
  path: string;
};

export function RouteActivatedBootstrapNavLink({ path, children, icon }: RouteActivatedBootstrapNavLinkProps) {
  const pathOnly = useMemo(() => new URL(path, window.location.href).pathname, [path]);
  const pathOnlyMatch = useMatch(`${pathOnly.replace(/\/$/, '')}/*`);

  return (
    <BootstrapNavLink active={pathOnlyMatch != null} to={path} icon={icon}>
      {children}
    </BootstrapNavLink>
  );
}
