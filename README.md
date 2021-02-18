# HumHub Richtext

## Build

In order to build the project, run the following command:

```
grunt build
```

## Test environment

In a test environment it is recommended to configure your `humhub\assets\ProsemirrorEditorAsset::$sourcePath` to point
to your own `dist` directory e.g. `'/humhub-prosemirror/dist'` and to enable the `$forceCopy` option.
