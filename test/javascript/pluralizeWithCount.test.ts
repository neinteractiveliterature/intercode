import pluralizeWithCount from '../../app/javascript/pluralizeWithCount';

test('it pluralizes when there are multiple items', () => {
  expect(pluralizeWithCount('cat', 2)).toEqual('2 cats');
});

test('it does not pluralize when there is 1 item', () => {
  expect(pluralizeWithCount('cat', 1)).toEqual('1 cat');
});
