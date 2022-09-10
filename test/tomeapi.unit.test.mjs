import { open } from 'sqlite';
import format from 'pg-format';
import tome, { initDb } from '../src/tomeapi';
import gen from '../tool/gen';
import mockDb from '../tool/mockDb';

jest.mock('sqlite');
open.mockImplementation(() => Promise.resolve(mockDb));

describe('CRUD:', () => {
  it('inserts a new page', (done) => {
    const ay = gen.page();
    mockDb.exec = jest.fn(() => Promise.resolve({ lastID: ay.page_id }));
    const vList = Object.values(ay);
    initDb()
      .then(() => {
        jest.clearAllMocks();
        return tome.upsertPage(ay);
      })
      .then((res) => {
        expect(res).toBe('Upserted 1 rows.');
        expect(mockDb.exec).toHaveBeenCalledTimes(1);
        expect(mockDb.exec.mock.calls[0][0]).toBe(format('INSERT INTO block (page_id,content,timestamp) VALUES (%L) ON CONFLICT (page_id) DO UPDATE SET (content,timestamp) = (%L)', vList, vList.slice(1)));
        done();
      });
  });

  it('reads a page', (done) => {
    const ay = gen.page();
    mockDb.get = jest.fn(() => Promise.resolve(ay));
    const cList = Object.keys(ay);
    initDb()
      .then(() => {
        jest.clearAllMocks();
        return tome.readPage(ay.page_id, cList);
      })
      .then((res) => {
        expect(res).toStrictEqual(ay);
        expect(mockDb.get).toHaveBeenCalledTimes(1);
        expect(mockDb.get.mock.calls[0][0]).toBe(format('SELECT (%I) FROM block WHERE page_id = %L', cList, ay.page_id));
        done();
      });
  });

  it('deletes a page', (done) => {
    const ay = gen.page();
    mockDb.exec = jest.fn(() => Promise.resolve({ changes: 1 }));
    initDb()
      .then(() => {
        jest.clearAllMocks();
        return tome.deletePage(ay.page_id);
      })
      .then((res) => {
        expect(res).toBe('Deleted 1 rows.');
        expect(mockDb.exec).toHaveBeenCalledTimes(1);
        expect(mockDb.exec.mock.calls[0][0]).toBe(format('DELETE * FROM block WHERE page_id = %L', ay.page_id));
        done();
      });
  });

  it('lists pages', (done) => {
    mockDb.all = jest.fn(() => Promise.resolve([ { page_id: 1 }, { page_id: 2 }, { page_id: 3 } ]));
    initDb()
      .then(() => {
        jest.clearAllMocks();
        return tome.listPage();
      })
      .then((res) => {
        expect(res).toStrictEqual([ 1, 2, 3 ]);
        expect(mockDb.all).toHaveBeenCalledTimes(1);
        expect(mockDb.all.mock.calls[0][0]).toBe('SELECT page_id FROM block');
        done();
      });
  });

  it('inserts a new chapter tag', (done) => {
    const ay = gen.chapter();
    mockDb.exec = jest.fn(() => Promise.resolve({ lastID: 1 }));
    const cList = Object.keys(ay);
    const vList = Object.values(ay);
    initDb()
      .then(() => {
        jest.clearAllMocks();
        return tome.upsertChapter(ay);
      })
      .then((res) => {
        expect(res).toBe('Upserted 1 rows.');
        expect(mockDb.exec).toHaveBeenCalledTimes(1);
        expect(mockDb.exec.mock.calls[0][0]).toBe(format('INSERT INTO toc (%I) VALUES (%L) ON CONFLICT (chapter_id, page_id) DO UPDATE SET (%I) = (%L)', cList, vList, cList.slice(2), vList.slice(2)));
        done();
      });
  });

  it('reads a chapter tag', (done) => {
    const ay = gen.chapter();
    mockDb.get = jest.fn(() => Promise.resolve(ay));
    const cList = Object.keys(ay);
    initDb()
      .then(() => {
        jest.clearAllMocks();
        return tome.readChapter(ay.chapter_id, ay.page_id, cList);
      })
      .then((res) => {
        expect(res).toStrictEqual(ay);
        expect(mockDb.get).toHaveBeenCalledTimes(1);
        expect(mockDb.get.mock.calls[0][0]).toBe(format('SELECT (%I) FROM toc WHERE chapter_id = %L AND page_id = %L', cList, ay.chapter_id, ay.page_id));
        done();
      });
  });

  it('deletes a chapter tag', (done) => {
    const ay = gen.chapter();
    mockDb.exec = jest.fn(() => Promise.resolve({ changes: 1 }));
    initDb()
      .then(() => {
        jest.clearAllMocks();
        return tome.deleteChapter(ay.chapter_id, ay.page_id);
      })
      .then((res) => {
        expect(res).toBe('Deleted 1 rows.');
        expect(mockDb.exec).toHaveBeenCalledTimes(1);
        expect(mockDb.exec.mock.calls[0][0]).toBe(format('DELETE * FROM toc WHERE chapter_id = %L AND page_id = %L', ay.chapter_id, ay.page_id));
        done();
      });
  });

  it('lists chapters', (done) => {
    mockDb.all = jest.fn(() => Promise.resolve([ { chapter_id: 'lorem' }, { chapter_id: 'ipsum' } ]));
    initDb()
      .then(() => {
        jest.clearAllMocks();
        return tome.listChapter();
      })
      .then((res) => {
        expect(res).toStrictEqual([ 'lorem', 'ipsum' ]);
        expect(mockDb.all).toHaveBeenCalledTimes(1);
        expect(mockDb.all.mock.calls[0][0]).toBe('SELECT chapter_id FROM toc');
        done();
      });
  });
});

