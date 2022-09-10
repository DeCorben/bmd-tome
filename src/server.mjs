import fastify from 'fastify';
import core from './tomeapi.mjs';

const server = fastify();

server.get('/', (_req, res) => {
    res.send('Hello, World!');
});

// create new page in block table
server.post('/page', (req, res) => res.send(core.upsertPage(req.body)));

// update page in block table
server.put('/page/:page_id', (req, res) => {
  const payload = res.body;
  payload.page_id = req.param.page_id;
  return res.send(core.upsertPage(payload));
});

// delete page from block table
server.delete('/page/:page_id', (req, res) => res.send(core.deletePage(req.param.page_id)));

// read page from block table
server.post('/page/:page_id', (req, res) => res.send(core.readPage(req.param.page_id)));

// get list of pages
server.get('/page', (_req, res) => res.send(core.listPage()));

// create new chapter tag in index table
server.post('/chapter', (req, res) => res.send(core.upsertChapter(req.body)));

// update chapter tag in index table
server.put('/chapter/:chapter_id/:page_id', (req, res) => {
  const payload = res.body;
  payload.chapter_id = req.param.chapter_id;
  payload.page_id = req.param.page_id;
  return res.send(core.upsertChapter(payload));
});

// delete chapter tag from index table
server.delete('/chapter/:chapter_id/:page_id', (req, res) => res.send(core.deleteChapter(req.param.chapter_id, req.param.page_id)));

// read chapter tags in index table
server.post('/chapter/:chapter_id/:post_id', (req, res) => res.send(core.readChapter(req.param.chapter_id, req.param.page_id)));

// read all pages attached to chapter tag
server.get('/chapter', (req, res) => {
  const list = core.listChapter();
  console.log(list);
  return res.send(list);
});

export default server;

