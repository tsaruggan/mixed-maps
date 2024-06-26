// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.resolve(process.cwd(), 'src', 'data', 'directions.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  res.status(200).json(JSON.parse(fileContents));
}
