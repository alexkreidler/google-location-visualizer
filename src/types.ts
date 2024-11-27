
export interface GoogleLocationHistory {
    semanticSegments: SemanticSegment[];
    rawSignals: RawSignal[];
    userLocationProfile: UserLocationProfile;
}

export interface RawSignal {
    activityRecord?: ActivityRecord;
    wifiScan?: WifiScan;
    position?: Position;
}

export interface EnrichedSignal {
    activityRecord?: ActivityRecord;
    wifiScan?: WifiScan;
    position: Position;
    date: Date;
}

export interface Position {
    LatLng: string;
    accuracyMeters: number;
    altitudeMeters: number;
    source: Source;
    timestamp: string; // Date;
    speedMetersPerSecond: number;
}
export enum Source {
    Cell = "CELL",
    Gps = "GPS",
    Wifi = "WIFI",
}

export interface ActivityRecord {
    probableActivities: ProbableActivity[];
    timestamp: Date;
}

export interface ProbableActivity {
    type: ProbableActivityType;
    confidence: number;
}

export enum ProbableActivityType {
    InRailVehicle = "IN_RAIL_VEHICLE",
    InRoadVehicle = "IN_ROAD_VEHICLE",
    InVehicle = "IN_VEHICLE",
    OnBicycle = "ON_BICYCLE",
    OnFoot = "ON_FOOT",
    Running = "RUNNING",
    Still = "STILL",
    Tilting = "TILTING",
    Unknown = "UNKNOWN",
    Walking = "WALKING",
}


export interface WifiScan {
    deliveryTime: Date;
    devicesRecords: DevicesRecord[];
}

export interface DevicesRecord {
    mac: number;
    rawRssi: number;
}

export interface SemanticSegment {
    startTime: Date;
    endTime: Date;
    timelinePath?: TimelinePath[];
    startTimeTimezoneUtcOffsetMinutes?: number;
    endTimeTimezoneUtcOffsetMinutes?: number;
    visit?: Visit;
    activity?: Activity;
    timelineMemory?: TimelineMemory;
}

export interface Activity {
    start: End;
    end: End;
    distanceMeters: number;
    topCandidate: ActivityTopCandidate;
}

export interface End {
    latLng: string;
}

export interface ActivityTopCandidate {
    type: TopCandidateType;
    probability: number;
}

export enum TopCandidateType {
    Cycling = "CYCLING",
    Flying = "FLYING",
    InBus = "IN_BUS",
    InPassengerVehicle = "IN_PASSENGER_VEHICLE",
    InSubway = "IN_SUBWAY",
    InTrain = "IN_TRAIN",
    Walking = "WALKING",
}

export interface TimelineMemory {
    trip: Trip;
}

export interface Trip {
    distanceFromOriginKms: number;
    destinations: Destination[];
}

export interface Destination {
    identifier: Identifier;
}

export interface Identifier {
    placeId: string;
}

export interface TimelinePath {
    point: string;
    time: Date;
}

export interface Visit {
    hierarchyLevel: number;
    probability: number;
    topCandidate: VisitTopCandidate;
}

export interface VisitTopCandidate {
    placeId: string;
    semanticType: SemanticType;
    probability: number;
    placeLocation: End;
}

export enum SemanticType {
    Home = "HOME",
    InferredHome = "INFERRED_HOME",
    SearchedAddress = "SEARCHED_ADDRESS",
    Unknown = "UNKNOWN",
}

export interface UserLocationProfile {
    frequentPlaces: FrequentPlace[];
}

export interface FrequentPlace {
    placeId: string;
    placeLocation: string;
    label: string;
}