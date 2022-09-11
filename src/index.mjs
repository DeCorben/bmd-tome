import server from './server.mjs';

server.ready()
  .then(() => {
    server.listen({ port: 1313 });
    console.log('Listening on port 1313.'); });

