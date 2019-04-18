import { useState } from 'react';
import { uniqueId } from 'lodash';

export default function useUniqueId(prefix) {
  const [id] = useState(uniqueId(prefix)); // don't care about setting this, it won't change
  return id;
}
