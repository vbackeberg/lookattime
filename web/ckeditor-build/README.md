This is a custom build of ckeditor that includes a column layout button and the simple upload adapter.

## Build a new version

To build a new version open `ckeditor5-lookattime\packages\ckeditor5-build-classic`.

`npm build`

Then copy the changed files over into `web\ckeditor-build`.

## Custom plugins

The two-column layout plugin is called `SimpleGrid`.
The upload adapter needs to be configured via `editorConfig`.
