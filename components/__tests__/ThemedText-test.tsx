import * as React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

it(`renders correctly`, () => {
  let tree: ReactTestRenderer;
  act(() => {
    tree = create(<ThemedText>Snapshot test!</ThemedText>);
  });

  expect(tree!.toJSON()).toMatchSnapshot();
});
