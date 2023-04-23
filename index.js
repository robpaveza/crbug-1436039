const SourceMaps = require('source-map');
const fs = require('fs').promises;

async function load() {
  const fileContents = await fs.readFile('./typescript_part/bin/result.js.map', {encoding: 'utf8'});
  const fileObj = JSON.parse(fileContents);
  const sourceMap = new SourceMaps.SourceMapConsumer(fileObj);
  return sourceMap;
}

function randomInteger(max = 10) {
  let result = Math.floor(Math.random() * max);
  if (result === 0) {
    result += 1;
  }
  return result;
}

async function process() {
  const sourceMap = await load();
  const resultSourceMap = new SourceMaps.SourceMapGenerator();

  let current = 0;
  while (current < 70000) {
    const currentIndex = current;
    const pathParts = [''];
    let depthOfNextStructure = randomInteger();
    while (depthOfNextStructure > 0) {
      pathParts.push(String(current++));
      depthOfNextStructure--;
    }
    const path = pathParts.join('/') + '.js';
    resultSourceMap.setSourceContent(path, `
// This file is intentionally blank and was generated on iteration ${currentIndex}.
// None of the output should be mapped to this file.
`);
    resultSourceMap.addMapping({
      source: path,
      generated: { line: 1, column: 1 },
      original: { line: 1, column: 1 },
    });
  }

  sourceMap.sources.forEach(source => {
    const content = sourceMap.sourceContentFor(source);
    resultSourceMap.setSourceContent(source, content);
  });

  sourceMap.eachMapping(mapping => {
    const newMapping = {
      source: mapping.source,
      generated: { line: mapping.generatedLine, column: mapping.generatedColumn },
      original: { line: mapping.originalLine, column: mapping.originalColumn },
    };
    resultSourceMap.addMapping(newMapping);
  });

  await fs.writeFile('./dist/result.js.map', resultSourceMap.toString(), {encoding: 'utf8'});
}

process().then(() => {
  console.log('Done');
}).catch(e => {
  console.error(e.stack);
});
