# HumHub Richtext

## Build
### Build with Gruntfile.js
In order to build the project, run the following command:

```
grunt rollup
```

### Build with rollup.config.js
**NOTE**: Before using this configuration, change the parameter 'type' in package.json to 'module'

For using run the following command in the console:

```
rollup -c
```

## Test environment
### Run tests in browser

- Build and run test server:

```
grunt
npm test-server
```

- Open [http://localhost:8090/](http://localhost:8090/)

### Run headless tests

- Run the test server and then run:

```
npm run test
```

### Test editor build in HumHub

In a test environment it is recommended to configure your `humhub\assets\ProsemirrorEditorAsset::$sourcePath` to point
to your own `dist` directory e.g. `'/humhub-prosemirror/dist'` and to enable the `$forceCopy` option.

## Publish

``` 
git pull
grunt rollup
npm version 2.1.x
npm publish
git push
```

- Release new Version on GitHub: https://github.com/humhub/humhub-prosemirror/releases/new


### Supported HumHub Versions


| Version  | HumHub Versions  |
|---|---|
| 2.0  | v1.15  |
| 2.1  | v1.16  |


