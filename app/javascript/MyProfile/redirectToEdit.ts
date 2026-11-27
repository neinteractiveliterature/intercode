import { replace } from 'react-router';

// Editing the bio is part of editing the profile
export const clientLoader = () => replace('./edit');
