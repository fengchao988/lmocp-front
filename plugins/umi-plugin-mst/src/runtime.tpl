import React from 'react';

import MobxContainer from './mst';

export function rootContainer(container) {
  return React.createElement(MobxContainer, null, container);
}
