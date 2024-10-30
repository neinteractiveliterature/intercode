import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View, { ViewOptions } from 'ol/View';
import { HTMLProps, useEffect, useState } from 'react';
import { fromLonLat } from 'ol/proj';
import Layer from 'ol/layer/Layer';

import 'ol/ol.css';

export type OpenLayersMapProps = Omit<HTMLProps<HTMLDivElement>, 'ref'> & {
  viewOptions: ViewOptions;
  overlayLayers?: Layer[];
};

function OpenLayersMap({ viewOptions, overlayLayers, ...divProps }: OpenLayersMapProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [view, setView] = useState<View>();

  useEffect(() => {
    setView((prevView) => {
      if (prevView) {
        // eslint-disable-next-line no-underscore-dangle
        prevView.applyOptions_(viewOptions);
        return prevView;
      } else {
        return new View(viewOptions);
      }
    });
  }, [viewOptions]);

  useEffect(() => {
    if (container != null) {
      const map = new Map({
        target: container,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          ...(overlayLayers ?? []),
        ],
        view,
      });

      return () => map.dispose();
    }
  }, [container, view, overlayLayers]);

  return (
    <div
      ref={(node) => {
        setContainer(node);
      }}
      {...divProps}
    />
  );
}

export { fromLonLat };

export default OpenLayersMap;
