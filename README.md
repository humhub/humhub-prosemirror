# HumHub Richtext

## Build

In order to build the project, run the following command:

```
grunt
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
