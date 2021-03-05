# Richtext configuration

## Presets

Presets are used to create predefined set of richtext configurations as for example:

- Configured set of plugins
- Configured set of menu items

The following default presets are available:

- `markdown`: The simplest preset which only contains plugins for basic markdown support
- `normal`: This preset extends `markdown` and adds richtext features as emoji, mentioning, oembed
- `full` (default): Extends `normal` and by default does not add any additional plugins, but may be extended by external plugins
- `document`: Extends `full` and can be used as base preset for document style output as for example wiki pages, adds an `anchor` plugin by default

### Include or exclude plugins

You can configure the set of plugins per editor state by the following configurations:

- `include`: Adds a plugin if it is not already part of the preset to an editor instance
- `exclude`: Removes a plugin if it is part of the preset to an editor instance
- `only`: Sets a static set of plugins (Note: doc, text, paragraph is the minimum requirement)

```javascript
// Will use the default full preset but exclude the emoji plugin
let editor1 = new MarkdownEditor('#stage1', {exclude: ['emoji']});

// Will use the base markdown preset, but add the emoji plugin
let editor3 = new MarkdownEditor('#stage3', {preset: 'markdown', include: ['emoji']});

// Will only include the given plugins, note we at least need doc, text, paragraph
let editor2 = new MarkdownEditor('#stage2', {only: ['doc', 'text', 'paragraph', 'strong']});
```

> Note: At the time of writing it is not supported to remove core markdown plugins when rendering the richtext, 
> therefore it is recommended to only exclude additional humhub richtext features as emoji and instead exclude other features
> from the menu.

> Note: excluding or including a plugin per editor instance will require a rebuild of the plugins and will not facilitate
> cached preset builds. If using this technique on multiple editors on a single page, this may affect the performance.

### Register a plugin to a preset

You can permanently add a plugin to a preset as follows:

```
window.prosemirror.plugin.registerPlugin({
    id: 'test',
    menu: (context) => [
        {
            id: 'testItem',
            group: 'format',
            item: new window.prosemirror.menu.MenuItem({
                run: (state, dispatch) => dispatch(state.tr.insertText("test!")),
                label: 'test'
            })
        }
    ]
}, 'markdown');
```

> Note: Add your plugins before the first editor creation, otherwise your plugin may not be inherited by sub presets.

### Hide menu items

Instead of excluding plugins, in most cases it is safer to just remove unwanted menu items or even item groups. You
can exclude menu items by id on global, preset or instance level as follows:

**Global exclude configuration:**

```
window.prosemirror.globalOptions.menu = {
    exclude: ['insertTable']
}
```

**Preset based configuration:**

```
window.prosemirror.globalOptions.presets = {
    wiki: {
        menu: {
            'exclude': ['insertTable']
        }
    }
}
```

**Instance based configuration:**

```
let editor1 = new MarkdownEditor('#stage1', {
    menu: {
        'exclude': ['insertTable']
    }
});
```

## Translation

You can define a translation map or callback on global or instance level. This is only required outside a
HumHub environment.

```
let editor1 = new MarkdownEditor('#stage1', {
    translate: {
        translate: {
            'Test me!': 'Teste mich!'
        }
    }
});
```

```
 window.humhub.richtext.globalOptions = { 
     translate: (key) => { 
         return { 'Test me!': 'Teste mich!'}[key]
     }
 };
```