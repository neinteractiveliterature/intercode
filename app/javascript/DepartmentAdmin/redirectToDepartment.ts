import { redirect } from 'react-router';

// A department has no page of its own beyond the list
export const clientLoader = () => redirect('..');
