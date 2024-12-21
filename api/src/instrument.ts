import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: [nodeProfilingIntegration()],
	tracesSampleRate: 1.0,
});

Sentry.profiler.startProfiler();

Sentry.startSpan({ name: "My First Transaction" }, () => {});

Sentry.profiler.stopProfiler();
