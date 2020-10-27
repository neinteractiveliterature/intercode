import { pluralize } from 'inflected';
import '../../app/javascript/inflections';

test('it pluralizes GM correctly', () => {
  expect(pluralize('GM')).toEqual('GMs');
});
