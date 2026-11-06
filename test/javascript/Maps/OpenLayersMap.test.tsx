import { useState } from 'react';
import { vi } from 'vitest';
import type View from 'ol/View';
import type { ViewOptions } from 'ol/View';

import { render, userEvent } from '../testUtils';

type MapConstructorOptions = { target: HTMLElement; view: View };
const mapInstances = vi.hoisted(() => [] as { options: MapConstructorOptions; dispose: () => void }[]);

vi.mock('ol/Map', () => ({
  default: class FakeMap {
    options: MapConstructorOptions;
    dispose = vi.fn();

    constructor(options: MapConstructorOptions) {
      this.options = options;
      mapInstances.push(this);
    }
  },
}));

import OpenLayersMap from '../../../app/javascript/Maps/OpenLayersMap';

function ChangeableMap() {
  const [viewOptions, setViewOptions] = useState<ViewOptions>({ center: [0, 0], zoom: 3 });

  return (
    <>
      <OpenLayersMap viewOptions={viewOptions} data-testid="map" />
      <button type="button" onClick={() => setViewOptions({ center: [100, 200], zoom: 7 })}>
        Move map
      </button>
    </>
  );
}

describe('OpenLayersMap', () => {
  beforeEach(() => {
    mapInstances.length = 0;
  });

  it('creates a map targeting its container with the initial view options', async () => {
    const { getByTestId } = await render(
      <OpenLayersMap viewOptions={{ center: [10, 20], zoom: 5 }} data-testid="map" />,
    );

    expect(mapInstances).toHaveLength(1);
    expect(mapInstances[0].options.target).toBe(getByTestId('map'));
    expect(mapInstances[0].options.view.getCenter()).toEqual([10, 20]);
    expect(mapInstances[0].options.view.getZoom()).toEqual(5);
  });

  it('applies changed view options to the same view without recreating the map', async () => {
    const user = userEvent.setup();
    const { getByRole } = await render(<ChangeableMap />);
    const { view } = mapInstances[0].options;

    await user.click(getByRole('button', { name: 'Move map' }));

    expect(mapInstances).toHaveLength(1);
    expect(mapInstances[0].options.view).toBe(view);
    expect(view.getCenter()).toEqual([100, 200]);
    expect(view.getZoom()).toEqual(7);
  });

  it('disposes the map when unmounted', async () => {
    const { unmount } = await render(<OpenLayersMap viewOptions={{ center: [0, 0], zoom: 1 }} />);

    unmount();

    expect(mapInstances[0].dispose).toHaveBeenCalledTimes(1);
  });
});
