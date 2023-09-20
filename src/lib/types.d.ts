export interface ICSVRecord {
  index: number;
  time: number;
  utcTime: number;
  lap: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  accuracy: number;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
}
