# HumHub Richtext

## Build

In order to build the project, run the following command:

```
grunt
```

## Test environment

### Run tests

- Build and run test server:

```
grunt
npm test-server
```

- Access [http://localhost:8090/](http://localhost:8090/)

### Test editor build in HumHub

In a test environment it is recommended to configure your `humhub\assets\ProsemirrorEditorAsset::$sourcePath` to point
to your own `dist` directory e.g. `'/humhub-prosemirror/dist'` and to enable the `$forceCopy` option.
