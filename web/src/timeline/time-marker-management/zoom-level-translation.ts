// Pre-define which date granularity to show at which zoom level.

import { Constants } from "../zooming/constants";
[
  [Constants.MAX_ZOOM_LEVEL, "hundred-thousand-years"],
  // ...
  [60, "hours"],
  [10, "ten-minutes"],
  [Constants.MIN_ZOOM_LEVEL, "minutes"]
];
