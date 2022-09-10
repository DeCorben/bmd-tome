const gen = {
  page: () => ({
    page_id: Math.random().toString(),
    content: Math.random().toString(),
    timestamp: Math.random().toString(),
  }),
  chapter: () => ({
    chapter_id: Math.random().toString(),
    page_id: Math.random().toString(),
    timestamp: Math.random().toString(),
  }),
};

export default gen;
