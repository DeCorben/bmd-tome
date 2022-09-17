import config from 'dotenv-safe';
config();
import server from './server';

server.ready()
  .then(() => {
    server.listen({ port: 1313 });
    console.log('Listening on port 1313.'); });

