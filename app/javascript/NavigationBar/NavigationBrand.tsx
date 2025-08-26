import { useContext, ReactNode } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import NavigationBarContext from './NavigationBarContext';

export type NavigationBrandProps = {
  item: {
    label: ReactNode;
  };
};

function NavigationBrand({ item }: NavigationBrandProps): React.JSX.Element {
  const { hideBrand } = useContext(NavigationBarContext);

  return (
    <Link to="/" className={classNames('navbar-brand', { 'd-none': hideBrand })}>
      {item.label}
    </Link>
  );
}

export default NavigationBrand;
