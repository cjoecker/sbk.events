/**
 * Renames some common hooks, so we can use an "unsafe" version,
 * in which the linting doesn't check the dependency array.
 *
 * Please use with care, as this can easily lead to bugs
 */

export { useEffect as useEffectUnsafe, useMemo as useMemoUnsafe } from "react";
