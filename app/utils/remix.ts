import { json as DeprecatedJSON } from "@remix-run/node";

// there seems not to be a good alternative for deprecated json
// https://github.com/remix-run/react-router/discussions/12257

// eslint-disable-next-line @typescript-eslint/no-deprecated, unicorn/prefer-export-from
export const json = DeprecatedJSON;
