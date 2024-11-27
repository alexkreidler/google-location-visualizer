"use client";

import { useState, useCallback, useRef } from "react";
import { EnrichedSignal, GoogleLocationHistory, RawSignal } from "./types";
import MapComponent from "./MapComponentMapLibre";
import DatePicker from "./DatePicker";
import TimeSlider from "./TimeSlider";
import FileUpload from "./FileUpload";

export default function LocationApp() {
  const [locationData, setLocationData] = useState<RawSignal[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeRange, setSelectedTimeRange] = useState<[number, number]>([
    0, 24,
  ]);

  const map = useRef<maplibregl.Map | null>(null);

  const handleFileUpload = useCallback((data: GoogleLocationHistory) => {
    setLocationData(data.rawSignals.filter((signal) => signal.position));
  }, []);

  const enrichedData = locationData
    .filter((signal) => signal.position)
    .map((signal) => ({
      ...signal,
      date: new Date(signal.position!.timestamp),
    })) as EnrichedSignal[];

  const filteredData = enrichedData.filter((signal) => {
    if (!selectedDate) return false;
    const signalDate = signal.date;
    return (
      signalDate.toDateString() === selectedDate.toDateString() &&
      signalDate.getHours() >= selectedTimeRange[0] &&
      signalDate.getHours() <= selectedTimeRange[1]
    );
  });
  const [_, setMarkers] = useState<Record<string, maplibregl.Marker>>({});

  return (
    <div className="flex h-screen">
      <div className="flex-grow">
        <MapComponent data={filteredData} map={map} setMarkers={setMarkers} />
      </div>
      <div className="p-4 bg-gray-100 h-screen flex flex-col  w-[22rem] max-w-sm">
        <FileUpload onUpload={handleFileUpload} />
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <TimeSlider value={selectedTimeRange} onChange={setSelectedTimeRange} />
        <div className="flex-grow overflow-y-scroll">
          {filteredData.length < 1 && (
            <div className="gap-2 flex flex-col h-full">
              <p>
                <b>Get Started:</b> Open your Timeline.json file, then select a
                date
              </p>
              <h1 className="font-bold">
                How to export your Google location data
              </h1>
              <p>
                Android: Settings &gt; Location &gt; Location Services &gt;
                Timeline &gt; Export Timeline Data
              </p>
              <p>
                iOS: Google Maps &gt; Your Timeline &gt; Location And Privacy
                Settings &gt; Export Timeline Data
              </p>
              <p>
                Web:{" "}
                <a
                  href="https://takeout.google.com/"
                  className="underline text-purple-600"
                >
                  Google Takeout
                </a>{" "}
                &gt; Location History, export once, then download and extract
                the ZIP file. (Only works if cloud sync enabled)
              </p>
              {/* <p>These steps will create a Timeline.json file you can open with the button above.</p> */}
              {/* <a className='underline text-purple-600'>source code</a>. */}
              {/* <div className='flex-grow'/> */}
              <p>
                Your data is not transmitted to any servers, it is visualized
                locally in your browser.
              </p>
            </div>
          )}
          <ul>
            {filteredData
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((signal, index, array) => {
                const prevSignal = array[index - 1];
                const nextSignal = array[index + 1];
                const showAltitude =
                  !prevSignal ||
                  signal.position.altitudeMeters !==
                    prevSignal.position.altitudeMeters;
                const showSpeed =
                  !nextSignal ||
                  signal.position.speedMetersPerSecond !==
                    nextSignal.position.speedMetersPerSecond;
                return (
                  <li
                    key={index}
                    className="mb-2 p-2 border-b border-gray-300 cursor-pointer"
                    onClick={() => {
                      const [lat, lng] =
                        signal.position.LatLng.split(",").map(parseFloat);
                      map.current?.flyTo({ center: [lng, lat], zoom: 17 });
                      // markers[signal.position.LatLng + signal.position.timestamp]?.togglePopup();
                    }}
                  >
                    <div>
                      {new Date(signal.position.timestamp).toLocaleTimeString()}
                      : {signal.position.LatLng}
                    </div>
                    {showAltitude && (
                      <div>
                        <strong>Altitude:</strong>{" "}
                        {signal.position.altitudeMeters.toFixed(2)} meters
                      </div>
                    )}
                    {showSpeed && (
                      <div>
                        <strong>Speed:</strong>{" "}
                        {signal.position.speedMetersPerSecond.toFixed(2)} m/s
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
