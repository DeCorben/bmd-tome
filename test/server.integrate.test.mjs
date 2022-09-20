import server from '../src/server.mjs';
import log from '../src/log.mjs';
import gen from '../tool/gen.mjs';

beforeAll(() => {
  log.debug('--------------------------------server.integrate--------------------------------');
});
describe('default values', () => {
  it('defaults to incrementing page numbers', (done) => {
    const base = gen.page({ id: false });
    base.page_id = 1;
    const target = gen.page({ id: false });
    server.inject({
      method: 'post',
      url: '/page',
      payload: base,
    })
      .then((res) => {
        expect(res.body).toBe('Upserted 1 rows.');
        return server.inject({
          method: 'post',
          url: `/page/${base.page_id}`,
        });
      })
      .then((res) => {
        expect(res.body).toStrictEqual(base);
        return server.inject({
          method: 'post',
          url: '/page',
          payload: target,
        });
      })
      .then((res) => {
        expect(res.body.page_id).toBe(2);
        done();
      });
  });
  it.todo('applies current timestamp to entries');
});
