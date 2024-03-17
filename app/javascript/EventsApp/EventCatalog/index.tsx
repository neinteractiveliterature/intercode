import { Route, Routes } from 'react-router';
import EventList from './EventList';

export default function EventCatalog(): JSX.Element {
  return (
    <Routes>
      <Route path="table" element={<>Table view</>} />
      <Route path="" element={<EventList />} />
    </Routes>
  );
}
