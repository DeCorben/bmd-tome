import fastify from 'fastify';
import core from './tomeapi.mjs';

const server = fastify();

server.get('/', (_req, res) => {
    res.send('Hello, World!');
});

// create new page in block table
server.post('/page', (req, res) => core.upsertPage(req.body)
  .then((resp) => res.send(resp)));

// update page in block table
server.put('/page/:page_id', (req, res) => {
  const payload = req.body;
  payload.page_id = req.params.page_id;
  return core.upsertPage(payload)
    .then((resp) => res.send(resp));
});

// delete page from block table
server.delete('/page/:page_id', (req, res) => core.deletePage(req.params.page_id)
  .then((resp) => res.send(resp)));

// read page from block table
server.post('/page/:page_id', (req, res) => core.readPage(req.params.page_id)
  .then((resp) => res.send(resp)));

// get list of pages
server.get('/page', (_req, res) => core.listPage()
  .then((resp) => res.send(resp)));

// create new chapter tag in index table
server.post('/chapter', (req, res) => core.upsertChapter(req.body)
  .then((resp) => res.send(resp)));

// update chapter tag in index table
server.put('/chapter/:chapter_id/:page_id', (req, res) => {
  const payload = req.body;
  payload.chapter_id = req.params.chapter_id;
  payload.page_id = req.params.page_id;
  return core.upsertChapter(payload)
    .then((resp) => res.send(resp));
});

// delete chapter tag from index table
server.delete('/chapter/:chapter_id/:page_id', (req, res) => core.deleteChapter(req.params.chapter_id, req.params.page_id)
  .then((resp) => res.send(resp)));

// read chapter tags in index table
server.post('/chapter/:chapter_id/:post_id', (req, res) => core.readChapter(req.params.chapter_id, req.params.page_id)
  .then((resp) => res.send(resp)));

// read all pages attached to chapter tag
server.get('/chapter', (_req, res) => core.listChapter()
    .then((resp) => res.send(resp)));

export default server;

