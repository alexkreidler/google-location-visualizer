// Experiment for higher performance visualization of many records
// Maybe using Deck.gl
// import * as geoarrow from "@geoarrow/geoarrow-js";
import { GoogleLocationHistory, RawSignal, Source } from './src/types';
import * as arrow from "apache-arrow"

export function historyToArrow(history: GoogleLocationHistory) {
  const sourceMap = {
    "CELL": 1,
    "GPS": 2,
    "WIFI": 3,
  }
  const data = history.rawSignals
    .filter(signal => signal.position)
    .map(signal => {
      const [lat, lng] = signal.position!.LatLng.split(',').map(parseFloat);
      return {
        lng,
        lat,
        accuracyMeters: signal.position!.accuracyMeters,
        altitudeMeters: signal.position!.altitudeMeters,
        source: signal.position!.source,
        timestamp: new Date(signal.position!.timestamp).getTime(),
        speedMetersPerSecond: signal.position!.speedMetersPerSecond
      };
    });

  // Use builders for each field
  const lngBuilder = arrow.makeBuilder({ type: new arrow.Float64() });
  const latBuilder = arrow.makeBuilder({ type: new arrow.Float64() });
  const accuracyBuilder = arrow.makeBuilder({ type: new arrow.Uint16() });
  const altitudeBuilder = arrow.makeBuilder({ type: new arrow.Float64() });
  const sourceBuilder = arrow.makeBuilder({ type: new arrow.Dictionary(new arrow.Utf8(), new arrow.Int8()) });
  const timestampBuilder = arrow.makeBuilder({ type: new arrow.TimestampSecond() });
  const speedBuilder = arrow.makeBuilder({ type: new arrow.Float64() });

  data.forEach(d => {
    lngBuilder.append(d.lng);
    latBuilder.append(d.lat);
    accuracyBuilder.append(d.accuracyMeters);
    altitudeBuilder.append(d.altitudeMeters);
    sourceBuilder.append(d.source);
    timestampBuilder.append(d.timestamp);
    speedBuilder.append(d.speedMetersPerSecond);
  });

  // Finish builders and create vectors
  const lngVector = lngBuilder.finish().toVector();
  const latVector = latBuilder.finish().toVector();
  const accuracyVector = accuracyBuilder.finish().toVector();
  const altitudeVector = altitudeBuilder.finish().toVector();
  const sourceVector = sourceBuilder.finish().toVector();
  const timestampVector = timestampBuilder.finish().toVector();
  const speedVector = speedBuilder.finish().toVector();

  // Create and return the Arrow table using the vectors
  return new arrow.Table({
    lng: lngVector,
    lat: latVector,
    accuracyMeters: accuracyVector,
    altitudeMeters: altitudeVector,
    source: sourceVector,
    timestamp: timestampVector,
    speedMetersPerSecond: speedVector
  });
}

export function downloadArrow(table: arrow.Table, filename: string = "table.arrow") {
  // Convert the Arrow table to a Uint8Array
  const arrowBuffer = arrow.tableToIPC(table, "file");

  // Create a Blob from the Uint8Array
  const blob = new Blob([arrowBuffer], { type: 'application/vnd.apache.arrow.file' });

  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Append the link to the body
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Clean up by removing the link and revoking the object URL
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

