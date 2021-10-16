import { useContext, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import NavigationBarContext from './NavigationBarContext';

export type NavigationBrandProps = {
  item: {
    label: ReactNode;
  };
};

function NavigationBrand({ item }: NavigationBrandProps): JSX.Element {
  const { hideBrand } = useContext(NavigationBarContext);

  return (
    <Link to="/" className={classNames('navbar-brand', { 'd-none': hideBrand })}>
      {item.label}
    </Link>
  );
}

export default NavigationBrand;
