import fs from 'fs';
import path from 'path';

const configPath = 'data/config.json';
const config = JSON.parse(fs.readFileSync(path.join(configPath)).toString());

export default config;
