import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import format from 'pg-format';
import config from './config.mjs';
import log from './log.mjs';

let db = null;

const initDb = async () => {
  if (!db) {
    log.debug('Initializing database');
    db = await open({
      filename: `data/${process.env.DBNAME}.db`,
      driver: sqlite3.Database,
    });
    log.silly('Post-open');
    // check table creation
    Object.keys(config.tables).forEach(async (v) => {
      const colText = config.tables[v].join(',');
      const qText = format('CREATE TABLE IF NOT EXISTS %I (%s)', v, colText);
      log.silly(`Pre table load:${qText}`);
      const callResult = await db.exec(qText);
      log.debug(`initDb table load:${callResult}`);
    });
  }
  log.silly(`Return db:${JSON.stringify(db, null, '\t')}`);
  return db;
};

const tome = {
  deleteChapter: async (chapter, page) => {
    await initDb();
    log.debug('tomeAPI deleteChapter');
    return db.exec(format('DELETE * FROM toc WHERE chapter_id = %L AND page_id = %L', chapter, page))
      .then((res) => `Deleted ${res.changes} rows.`);
  },
  deletePage: async (page) => {
    await initDb();
    log.debug('tomeAPI deletePage');
    return db.exec(format('DELETE * FROM block WHERE page_id = %L', page))
      .then((res) => `Deleted ${res.changes} rows.`);
  },
  listChapter: async () => {
    await initDb();
    log.debug('tomeAPI listChapter');
    return db.all('SELECT chapter_id FROM toc')
      .then((res) => ({ list: res.map((v) => v.chapter_id) }));
  },
  listPage: async () => {
    await initDb();
    log.debug('tomeAPI listPage');
    return db.all('SELECT page_id FROM block')
      .then((res) => ({ list: res.map((v) => v.page_id) }));
  },
  readChapter: async (chapter, page, list) => {
    await initDb();
    log.debug('tomeAPI readChapter');
    return db.get(format('SELECT (%I) FROM toc WHERE chapter_id = %L AND page_id = %L', list, chapter, page));
  },
  readPage: async (page, list) => {
    await initDb();
    log.debug('tomeAPI readPage');
    return db.get(format('SELECT (%I) FROM block WHERE page_id = %L', list, page));
  },
  upsertChapter: async (chapter) => {
    await initDb();
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
  upsertPage: async (page) => {
    await initDb();
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
        log.debug(`tomeAPI db exec result:${JSON.stringify(res, null, '\t')}`);
        if (res.lastID === page.page_id) {
          return 'Upserted 1 rows.';
        }
        return res;
      });
  },
};

export default tome;
