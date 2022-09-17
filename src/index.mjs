import config from 'dotenv-safe';
config();
import server from './server';

server.ready()
  .then(() => {
    server.listen({ port: 4242 });
    console.log('Listening on port 4242.');
  });

