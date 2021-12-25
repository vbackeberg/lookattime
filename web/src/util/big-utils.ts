import Big from "big.js";
export default class BigUtils {
  public static max(a: Big, b: Big): Big {
    return a.gt(b) ? a : b;
  }

  public static min(a: Big, b: Big): Big {
    return a.lt(b) ? a : b;
  }
}
