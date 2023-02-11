/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

/*
 * Deployed via
 * DENO_DEPLOY_TOKEN=... deployctl deploy --project=relatable --prod main.ts
 */
import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

await start(manifest, {port: 5000});
