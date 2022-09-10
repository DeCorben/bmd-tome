import server from '../src/server.mjs';
import core from '../src/tomeapi.mjs';

jest.mock('../src/tomeapi.mjs');

beforeAll(() => {
  core.upsertPage.mockImplementation(() => Promise.resolve({ feedback: 'Upserted 1 rows.' }));
  core.deletePage.mockImplementation(() => Promise.resolve({ feedback: 'Deleted 1 rows.' }));
  core.readPage.mockImplementation(() => Promise.resolve({ page_id: 1, content: 'lorem', timestamp: 'fuget' }));
  core.listPage.mockImplementation(() => Promise.resolve({ list: [1, 2, 3] }));
  core.upsertChapter.mockImplementation(() => Promise.resolve({ feedback: 'Upserted 1 rows.' }));
  core.deleteChapter.mockImplementation(() => Promise.resolve({ feedback: 'Deleted 1 rows.' }));
  core.readChapter.mockImplementation(() => Promise.resolve({ chapter_id: 'lorem', page_id: 1, timestamp: 'fuget' }));
  core.listChapter.mockImplementation(() => Promise.resolve({ list: ['lorem', 'ipsum', 'dolor'] }));
});

describe('Wave 1', () => {
  it('post /page', (done) => {
    server.inject({
      method: 'post',
      url: '/page',
      payload: {
        page_id: 1,
        content: 'stand in text',
      },
    })
      .then((res) => {
        expect(res.body).toStrictEqual(JSON.stringify({ feedback: 'Upserted 1 rows.' }));
        done();
      });
  });

  it('put /page/{id}', (done) => {
    server.inject({
      method: 'put',
      url: '/page/1',
      payload: {
        content: 'new and different text',
      },
    })
      .then((res) => {
        expect(res.body).toStrictEqual(JSON.stringify({ feedback: 'Upserted 1 rows.' }));
        done();
      });
  });

  it('delete /page/{id}', (done) => {
    server.inject({
      method: 'delete',
      url: '/page/1',
    })
      .then((res) => {
        expect(res.body).toStrictEqual(JSON.stringify({ feedback: 'Deleted 1 rows.' }));
        done();
      });
  });

  it('post /page/{id}', (done) => {
   server.inject({
     method: 'post',
     url: '/page/1',
     payload: {
       fields: [
         'page_id',
         'content',
         'timestamp'
       ],
     },
   })
     .then((res) => {
       expect(res.body).toStrictEqual(JSON.stringify({ page_id: 1, content: 'lorem', timestamp: 'fuget' }));
       done();
     });
  });

  it('get /page', (done) => {
    server.inject({
      method: 'get',
      url: '/page',
    })
      .then((res) => {
        expect(res.body).toStrictEqual(JSON.stringify({ list: [1, 2, 3] }));
        done();
      });
  });

  it('post /chapter', (done) => {
    server.inject({
      method: 'post',
      url: '/chapter',
      payload: {
        chapter_id: 'lorem',
        page_id: 1,
      },
    })
      .then((res) => {
        expect(res.body).toStrictEqual(JSON.stringify({ feedback: 'Upserted 1 rows.' }));
        done();
      });
  });

  it('put /chapter/{id}', (done) => {
    server.inject({
      method: 'put',
      url: '/chapter/lorem',
      payload: {
        page_id: 1,
      },
    })
      .then((res) => {
        expect(res.body).toStrictEqual(JSON.stringify({ feedback: 'Upserted 1 rows.' }));
        done();
      });
  });

  it('delete /chapter/{chapter_id}/{page_id}', (done) => {
    server.inject({
      method: 'delete',
      url: '/chapter/lorem/1',
    })
      .then((res) => {
        expect(res.body).toStrictEqual(JSON.stringify({ feedback: 'Deleted 1 rows.' }));
        done();
      });
  });

  it('post /chapter/{chapter_id}/{page_id}', (done) => {
    server.inject({
      method: 'post',
      url: '/chapter/lorem/1',
      payload: {
        fields: [
          'chapter_id',
          'page_id',
          'timestamp',
        ],
      },
    })
      .then((res) => {
        expect(res.body).toStrictEqual(JSON.stringify({ chapter_id: 'lorem', page_id: 1, timestamp: 'fuget' }));
        done();
      });
  });

  it.only('get /chapter', (done) => {
    server.inject({
      method: 'get',
      url: '/chapter',
    })
      .then((res) => {
        console.log(res.body);
        expect(res.body).toStrictEqual(JSON.stringify({ list: ['lorem', 'ipsum', 'dolor'] }));
        done();
      });
  });
});

