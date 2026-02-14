#!/usr/bin/env node
import process from 'node:process';
import minimist from 'minimist';
import { WebSocketServer } from 'ws';
import { buildTS } from './bundle';
import { startServer } from './server';

async function main() {
  const { dev: isDev = false } = minimist(process.argv.slice(2));

  let wss: WebSocketServer | undefined;
  if (isDev) {
    wss = new WebSocketServer({ port: 8080 });
    startServer(true);
  }
  function reloadClients() {
    console.log(`[${new Date().toLocaleString()}] Build completed successfully!`);
    if (wss?.clients) {
      for (const client of wss.clients) {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: 'reload' }));
        }
      }
    }
  }
  await buildTS({
    isDev,
    onSuccess: reloadClients,
  });
}

main().catch((error) => {
  console.error('Error during build:', error);
  process.exit(1);
});
