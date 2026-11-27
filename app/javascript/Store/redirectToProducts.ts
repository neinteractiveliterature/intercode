import { redirect } from 'react-router';

// Store administration starts at the products
export const clientLoader = () => redirect('./products');
