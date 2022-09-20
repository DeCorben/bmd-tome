const gen = {
  page: ({ id = true, stamp = true } = {}) => {
    const out = { content: Math.random().toString() };
    if (id) {
      out.page_id = Math.random().toString();
    }
    if (stamp) {
      out.timestamp = Math.random().toString();
    }
    return out;
  },
  chapter: () => ({
    chapter_id: Math.random().toString(),
    page_id: Math.random().toString(),
    timestamp: Math.random().toString(),
  }),
};

export default gen;
