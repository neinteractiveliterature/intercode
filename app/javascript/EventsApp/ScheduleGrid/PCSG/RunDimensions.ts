import { FiniteTimespan } from '../../../Timespan';

export type RunDimensions = {
  runId: number;
  timespan: FiniteTimespan;
  laneIndex: number;
  timeAxisStartPercent: number;
  timeAxisSizePercent: number;
};
