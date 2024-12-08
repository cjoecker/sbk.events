import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://2984a28357ecebb8ffff932fd110fe1e@o4508432566255616.ingest.de.sentry.io/4508432570318928",
    tracesSampleRate: 1,
    autoInstrumentRemix: true
})