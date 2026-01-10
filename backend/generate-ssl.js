import devcert from 'devcert';
import fs from 'fs';

async function generate() {
  let ssl = await devcert.certificateFor('localhost');
  fs.writeFileSync('./localhost-key.pem', ssl.key);
  fs.writeFileSync('./localhost.pem', ssl.cert);
  console.log("SSL files generated successfully!");
}
generate();