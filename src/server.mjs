import fastify from 'fastify';
import core from './tomeapi.mjs';
import log from './log.mjs';

const server = fastify();

server.get('/', (_req, res) => {
  log.debug('server get /');
  return res.send('Hello, World!');
});

// create new page in block table
server.post('/page', (req, res) => {
  log.debug('server post /page');
  return core.upsertPage(req.body)
    .then((resp) => res.send(resp));
});

// update page in block table
server.put('/page/:page_id', (req, res) => {
  log.debug('server put /page/:page_id');
  const payload = req.body;
  payload.page_id = req.params.page_id;
  return core.upsertPage(payload)
    .then((resp) => res.send(resp));
});

// delete page from block table
server.delete('/page/:page_id', (req, res) => {
  log.debug('server delete /page/:page_id');
  return core.deletePage(req.params.page_id)
    .then((resp) => res.send(resp));
});

// read page from block table
server.post('/page/:page_id', (req, res) => {
  log.debug('server post /page/:page_id');
  return core.readPage(req.params.page_id)
    .then((resp) => res.send(resp));
});

// get list of pages
server.get('/page', (_req, res) => {
  log.debug('server get /page');
  return core.listPage()
    .then((resp) => res.send(resp));
});

// create new chapter tag in index table
server.post('/chapter', (req, res) => {
  log.debug('server post /chapter');
  return core.upsertChapter(req.body)
    .then((resp) => res.send(resp));
});

// update chapter tag in index table
server.put('/chapter/:chapter_id/:page_id', (req, res) => {
  log.debug('server put /chapter/:chapter_id/:page_id');
  const payload = req.body;
  payload.chapter_id = req.params.chapter_id;
  payload.page_id = req.params.page_id;
  return core.upsertChapter(payload)
    .then((resp) => res.send(resp));
});

// delete chapter tag from index table
server.delete('/chapter/:chapter_id/:page_id', (req, res) => {
  log.debug('server delete /chapter/:chapter_id/:page_id');
  return core.deleteChapter(req.params.chapter_id, req.params.page_id)
    .then((resp) => res.send(resp));
});

// read chapter tags in index table
server.post('/chapter/:chapter_id/:post_id', (req, res) => {
  log.debug('server post /chapter/:chapter_id/:page_id');
  return core.readChapter(req.params.chapter_id, req.params.page_id)
    .then((resp) => res.send(resp));
});

// read all pages attached to chapter tag
server.get('/chapter', (_req, res) => {
  log.debug('server get /chapter');
  return core.listChapter()
    .then((resp) => res.send(resp));
});

export default server;
