# Canvas App

A boilerplate for adding new front-end apps to Canvas. Hack Week project from
June 2020

## What is it?

Canvas App is a boilerplate built with Parcel and based on Create React App. It
is designed to make it easy and fast to create and develop a new app in Canvas.
It (will eventually) support:

- Fast development mode without having to run Canvas
- API route proxy and/or mocking (proxy not working at all)
- Integrated translations
- SPA functionality with client-side routers
- Dynamic theming through InstUI
- Code-splitting (not working super well)
- TypeScript Support (Works out of the box)

## Getting Started

First, duplicate this folder.

Change the package name in `package.json` to whatever you want.

To insert the bundled code into Canvas, you'll have to create a file in the
`/app/jsx/bundles` folder. Create a file, and add the following (replacing
`@instructure/canvas-app` with the package name):

```js
import {render} from "@instructure/canvas-app";

const domNode = document.getElementById("root");

render(domNode);
```

Then, in your Ruby controller, load the JS bundle and render it into whatever
layout you want. Make sure it includes a place for your React app to be rendered
into.

```ruby
class MyController < ApplicationController
  def canvas_app
    js_bundle :canvas_app
    render html: '<div id="root">Loading...</div>'.html_safe,
           layout: 'layouts/bare'
  end
end
```

And then add a route to `/app/config/routes.rb`. If you are planning on using a
client-side router, like React Router, then make sure your route is configured
with a wildcard:

```rb
# routes.rb
get 'canvas_app/*anything' => 'my#canvas_app'
```

The wildcard route has Canvas return the same client-side bundle for any route.
Once the JavaScript bundle loads, the React app will correctly display whatever
page it is supposed to based on the URL. This allows you to use a client-side
router, such as React Router.

## Starting the App

Once you've configured Canvas to render your app to a page, you can start the
build process. In your app folder, run

```bash
yarn start:canvas
```

This will watch your changes and rebuild your project whenever you save your
files.

Then, in your root Canvas directory, run

```bash
yarn build:watch
```

This will take the changes made in your package and make it available to Canvas.
Then you can access your app at the URL you configured.

Whenever you make changes, you will have to manually reload the browser. Hot
module reloading isn't supported.

## Running Independently

If you want a faster feedback cycle, you can run your app independent of Canvas.
To do this, run

```bash
yarn start
```

This will open your app in a browser with hot module reloading enabled. It loads
the base InstUI theme from Canvas.

## Localization and Internationalization

This package uses format-message for translations and translations are
automatically extracted and processed by Canvas as part of Canvas' normal build
process. All you have to do is `import formatMessage from '../format-message'`
(the file in the root of the package) and you're all set.

## Theming and InstUI

InstUI works out of the box with Canvas App, and when running in a Canvas page,
the InstUI components will automatically pick up the current theme. When running
independently of Canvas, Canvas App will use the default Canvas theme.

## TypeScript

If you want to use TypeScript, go for it! Just add the `.tsx` extension for your
React files and `.ts` for any other file. These will automatically be transpiled
to JavaScript when the project is built.

## API Mocking

When you are running your app independently, you'll need to have some way to
call the Canvas API to get the data you need. I wasn't able to figure out how to
properly proxy authorized API routes from Canvas, but [MSW](https://mswjs.io)
has been integrated and can be used to create mocks for any API which Canvas
provides. Check the documentation page for how to add your own mocks.

A proxy is currently set up in the `mocks.js` file. You can configure the origin
of your Canvas installation by duplicating `.env.example` and modifying the
`CANVAS_ORIGIN` environment variable.

You won't need to use MSW or proxy or mock API calls when you are running your
app within Canvas.
