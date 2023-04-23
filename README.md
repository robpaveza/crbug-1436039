This repository illustrates [CRBug 1436039](https://crbug.com/1436039).

## Main repro

The issue exists that any combination of source files and source-mapped source files with more than approximately 65,502 unique path components across the totality of the workspace will cause Chromium DevTools to be unable to load and resolve all of those files. This is exhibited in this project by hosting [./dist](./dist) in a web server and viewing index.html. Although result.js can have breakpoints set, the contributing files 'hello.ts' and 'world.ts' cannot be loaded. Loading a secondary Devtools instance will yield this error stack:

```
Uncaught (in promise) Error: CharacterIdMap ran out of capacity!
    at CharacterIdMap.toChar (common.js:1:1186)
    at persistence.js:1:50951
    at Array.map (<anonymous>)
    at ce.encode (persistence.js:1:50930)
    at me.similarFiles (persistence.js:1:58912)
    at pe.createBinding (persistence.js:1:57640)
    at pe.computeNetworkStatus (persistence.js:1:55064)
    at pe.onUISourceCodeAdded (persistence.js:1:54018)
    at persistence.js:1:52077
    at h.dispatchEventToListeners (common.js:1:48059)
```

## Repro 2

A variation on this bug is in [./dist2](./dist2). In this case, load and attach DevTools, then invoke the 2nd button. A message will be written to the console, and you can successfully click on the link to go to delay-loaded.js, but when you right-click on the file in the Sources tab and click "Reveal in sidebar," the reveal operation will fail, and the subdirectory `sub` and the file `delay-added.js` doesn't exist in the folder.
