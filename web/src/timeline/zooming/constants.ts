export class Constants {
  /**
   * The maximum zoom level corresponds to how many pixels
   * the browser allows on the horizontal axis, i.e. the
   * maximum value for translateX / position left.
   *
   * The maximum zoom level indicates that one absolute browser pixel
   * will correspond to 1,728,000,000,000 relative units ()
   */
  public static MAX_ZOOM_LEVEL = 1_728_000_000_000;

  /**
   * The minimum zoom level indicates that one absolute browser pixel
   * will correspond to one relative unit (one second).
   */
  public static MIN_ZOOM_LEVEL = 1;
}
