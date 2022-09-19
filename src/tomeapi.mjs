import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import format from 'pg-format';
import config from './config.mjs';
import log from './log.mjs';

let db = null;

export const initDb = async () => {
  log.debug('Initializing database');
  db = await open({
    filename: 'data/tome.db',
    driver: sqlite3.Database,
  })
    .then(async (res) => {
      // check table creation
      Object.keys(config.tables).forEach(async (v) => {
        await res.exec(format('CREATE TABLE IF NOT EXISTS %I (%I)', v, config.tables[v]));
      });
      return res;
    });
};

const tome = {
  deleteChapter: (chapter, page) => {
    log.debug('tomeAPI deleteChapter');
    return db.exec(format('DELETE * FROM toc WHERE chapter_id = %L AND page_id = %L', chapter, page))
      .then((res) => `Deleted ${res.changes} rows.`);
  },
  deletePage: (page) => {
    log.debug('tomeAPI deletePage');
    return db.exec(format('DELETE * FROM block WHERE page_id = %L', page))
      .then((res) => `Deleted ${res.changes} rows.`);
  },
  listChapter: () => {
    log.debug('tomeAPI listChapter');
    return db.all('SELECT chapter_id FROM toc')
      .then((res) => ({ list: res.map((v) => v.chapter_id) }));
  },
  listPage: () => {
    log.debug('tomeAPI listPage');
    return db.all('SELECT page_id FROM block')
      .then((res) => ({ list: res.map((v) => v.page_id) }));
  },
  readChapter: (chapter, page, list) => {
    log.debug('tomeAPI readChapter');
    return db.get(format('SELECT (%I) FROM toc WHERE chapter_id = %L AND page_id = %L', list, chapter, page));
  },
  readPage: (page, list) => {
    log.debug('tomeAPI readPage');
    return db.get(format('SELECT (%I) FROM block WHERE page_id = %L', list, page));
  },
  upsertChapter: (chapter) => {
    log.debug('tomeAPI upsertChapter');
    const cols = Object.keys(chapter);
    const vals = cols.map((v) => chapter[v]);
    const trunc = cols.filter((v) => !v.match(/chapter_id|page_id/));
    return db.exec(format(
      'INSERT INTO toc (%I) VALUES (%L) ON CONFLICT (chapter_id, page_id) DO UPDATE SET (%I) = (%L)',
      cols,
      vals,
      trunc,
      trunc.map((v) => chapter[v]),
    ))
      .then(() => 'Upserted 1 rows.');
  },
  upsertPage: (page) => {
    log.debug('tomeAPI upsertPage');
    const cols = Object.keys(page);
    const vals = cols.map((v) => page[v]);
    const trunc = cols.filter((v) => !v.match(/page_id/));
    const query = format(
      'INSERT INTO block (%I) VALUES (%L) ON CONFLICT (page_id) DO UPDATE SET (%I) = (%L)',
      cols,
      vals,
      trunc,
      trunc.map((v) => page[v]),
    );
    return db.exec(query)
      .then((res) => {
        if (res.lastID === page.page_id) {
          return 'Upserted 1 rows.';
        }
        return res;
      });
  },
};

export default tome;
