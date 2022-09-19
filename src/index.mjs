import { config } from 'dotenv-safe';
import server from './server.mjs';
import log from './log.mjs';

config();

server.ready()
  .then(() => {
    server.listen({ port: 1313 });
    log.info('Listening on port 1313.');
  });
