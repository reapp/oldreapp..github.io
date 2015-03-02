## Creating a Native app with React, Flux and Reapp

React is enabling frontend developers to build apps like never before. It makes
them easier to reason about with it's one-way data binding and declarative interface,
and much faster with it's use of the Virtual DOM. [Reapp](http://reapp.io) is a mobile
app development kit taht was announced last month to take advantage of the performance
and productivitiy benefits of React.

But, React is just one piece of building a complete app. It doesn't tell us how to handle
data, routing, or really anything else but rendering to DOM. Luckily, Reapp will provide us
with everything we need to do everything.

Today, we're going to create an app using Reapp that pulls pictures from the Flickr API
and displays them in a photo gallery.

### What we'll be building

![Video demonstration of the app](http://gfycat.com/DistortedImpureAmericanwarmblood)

### Starting out

With node installed, lets run `sudo install -g reapp` to install the Reapp CLI.
Once that installs, run `reapp new flickrapp`. Finally, `cd flickrapp` and `reapp run`.

You should see this:

![CLI start](/assets/cli.png)

Browse to [localhost:3010](http://localhost:3010) and you can see the default Reapp app:

![Default app](/assets/first-run.png)

**Tip: With Chrome's Developer Tools, [enable mobile device emulation](https://developer.chrome.com/devtools/docs/device-mode) to
view your app as a mobile app**

![Dev tools](/assets/dev-tools.png)

Alright! Now we're fully set up with a React stack using Reapp components. Lets check the file
structure:

```
/app
  components/
    home/
      Sub.jsx
    App.jsx
    Home.jsx
  app.js
  routes.js
/assets
```

### Start Our View

Reapp scaffolds out an example app, but we won't need much more than a single page. In `routes.js`
lets put this:

```js
  module.exports = ({ routes, route }) =>
    routes(require,
      route('app', '/', { dir: '' })
    );
```

This will wire up the `/app` route to our `./components/App.jsx` file. Since we've changed all the
routes, lets just change empty the default App.jsx and just put in a View:

```js
import React from 'react';
import View from 'reapp-ui/views/View';

export default React.createClass({
  render() {
    var { photos } = this.state;

    return (
      <View title="Flickr Search" styles={{ inner: { padding: 20 } }}>

      </View>
    );
  }
});
```

If you refresh, you should see an empty view with your new title "Flickr Search" at top.


### Fetch Data from Flickr

Let's fill that View with our photos from Flickr.
First, you'll need to get yourself a Flickr account and API key. Luckily, it's a quick process.
You can [sign in here to request a key](https://www.flickr.com/services/apps/create/noncommercial/?).

After filling out their form copy the Public Key they give you and we'll add it as a constant to
App.jsx. We also need the URL we'll construct, which I found by using their [API explorer](https://www.flickr.com/services/api/explore/flickr.photos.search).
It should look like this:

```js
const key = '__YOUR_KEY_HERE__';
const base = 'https://api.flickr.com/services/rest/?api_key=${key}&format=rest&format=json&nojsoncallback=1';
```js

Be sure to put your key instead of "__YOUR_KEY_HERE__".

**Note: `const` is a new feature in the next version of JavaScript, called ES6. It's just like
a variable, but instead we're saying it will *never* be changed.

How can we use this in our app now? Reapp has a [Webpack](webpack.github.io) build system built in
that gives you all sorts of features, including ES6 support!**

Next, define `getInitialState()` on our React class, so our component can track the photos
we'll be fetching. We add this as the first property after React.createClass.
Because we're storing photos in a list, add an array:

```js
getInitialState() {
  return {
    photos: []
  }
},
```

This will give us access to `this.state.photos` in our render function. We'll also want our UI,
so lets add a Button and Input to use for searching:

```js
import Button from 'reapp-ui/components/Button';
import Input from 'reapp-ui/components/Input';
```

And then change the `render()` function:

```js
  render() {
    var { photos } = this.state;

    return (
      <View title="Flickr Search">
        <Input ref="search" />
        <Button onTap={this.handleSearch}>Search Images</Button>

        <div className="verticalCenter">
          {!photos.length &&
            <p>No photos!</p>
          }
        </div>
      </View>
    );
  }
```

Pretty easy! There's a few things to note here. First,  notice the `ref` attribute
on the Input? Ref is short for reference, and lets us track DOM elements in our class.
We'll use that in the future for getting the value of the field.

Also, note `className="verticalCenter"` on the div. Two things: Because we're using JSX
that compiles to JS objects, we can't use the normal `class` attribute, so instead use use
the JavaScript convention of `className` to set the class. The `verticalCenter` property is
given to us by Reapp, that will align things centered on our page.

See the `onTap` property on Button? It's pointing to `this.handleSearch`.
But, we don't have any handleSearch function. React will expect that function defined on the
class, so let's wire it up. First, `npm install --save superagent` which gives us the excellent
[Superagent](https://github.com/visionmedia/superagent) request library. Then, import it:

```js
import Superagent from 'superagent';
```

Finally, define handleSearch:

```js
  handleSearch() {
    let searchText = this.refs.search.getDOMNode().value;
    Superagent
      .get(`${base}&method=flickr.photos.search&text=${searchText}&per_page=10&page=1`, res => {
        if (res.status === 200 && res.body.photos)
          this.setState({
            photos: res.body.photos.photo
          });
      });
  },
```

A few notes:

- `this.refs.search.getDOMNode()` returns the input DOM node that we put the "search" ref on earlier.
- `${base}` will grab the URL we put in the constant.
- `this.setState` will take our response photos and put them into the `this.state.photos` array
we defined earlier in `getInitialState`.


### Displaying Flickr Photos

Now we've fetched our Flickr photos and put them into the state. The last step is to display them.
You can add this to the first line of your render function to see what Flickr returns:

```js
render() {
  console.log(this.state.photos);
  // ... rest of render
}
```

In your console you'll see that Flickr returns an object with some properties. On [this helpful page](https://www.flickr.com/services/api/misc.urls.html)
I found out how to render the URL's for flickr.

Lets add a new function to the class:

```js
  getFlickrPhotoUrl(image) {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;
  },
```

This function takes our Flickr object and turns them into the URL we need to display.
Next, let's edit the handleSearch `setState` call:

```js
  this.setState({
    photos: res.body.photos.photo.map(this.getFlickrPhotoUrl)
  });
```

The `map` function will loop over those photo objects and pass them to getFlickrPhotoUrl,
which returns our URL. We're all ready to display them!

Let's import the Gallery component from reapp and use it:

```js
import Gallery from 'reapp-ui/components/Gallery';
```

In the render function, below the `<p>No photos found!</p>` block:

```js
  {!!photos.length &&
    <Gallery
      images={photos}
      width={window.innerWidth}
      height={window.innerHeight - 44}
    />
  }
```

The Gallery widget takes these three properties and outputs fullscreen
images that you can swipe between. With this in place, we have completed
the flow of our app. Check out your browser and see it in action.

***Note: Why `window.innerHeigth - 44`?
We're adjusting for the TitleBar height in our app. There are better
ways we could do this, but for now this is simple and works well**

### Final touches

We're just about good, but there's a couple tweaks we can do. The gallery never let's
us close it as it is now. If we add an onClose property to gallery though, it will let us.
But, we'll also need to update the state to reflect the gallery being closed. It's actually
pretty easy. Just add this to Gallery:

```js
  onClose={() => this.setState({ photos: [] })}
```

Also, our Input looks a little plain as it is. Let's add a border, margin and placeholder:

```js
  <Input ref="search" placeholder="Enter your search" styles={{
    input: {
      margin: '0 0 10px 0',
      border: '1px solid #ddd'
    }
  }} />
```

Much better!

### Final code

As is, our entire codebase fits into the `./components/App.jsx` file. It's easy to read
and understand and uses some nice new features of ES6. Here it is:

```js
import React from 'react';
import View from 'reapp-ui/views/View';
import Button from 'reapp-ui/components/Button';
import Input from 'reapp-ui/components/Input';
import Superagent from 'superagent';
import Gallery from 'reapp-ui/components/Gallery';

const MY_KEY = '__YOUR_KEY_HERE__';
const base = `https://api.flickr.com/services/rest/?api_key=${MY_KEY}&format=rest&format=json&nojsoncallback=1`;

export default React.createClass({
  getInitialState() {
    return {
      photos: []
    }
  },

  // see: https://www.flickr.com/services/api/misc.urls.html
  getFlickrPhotoUrl(image) {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;
  },

  handleSearch() {
    let searchText = this.refs.search.getDOMNode().value;
    Superagent
      .get(`${base}&method=flickr.photos.search&text=${searchText}&per_page=10&page=1`, res => {
        if (res.status === 200 && res.body.photos)
          this.setState({
            photos: res.body.photos.photo.map(this.getFlickrPhotoUrl)
          });
      });
  },

  render() {
    var { photos } = this.state;

    return (
      <View title="Flickr Search" styles={{ inner: { padding: 20 } }}>

        <Input ref="search" placeholder="Enter your search" styles={{
          input: {
            margin: '0 0 10px 0',
            border: '1px solid #ddd'
          }
        }} />
        <Button onTap={this.handleSearch}>Search Images</Button>

        <div className="verticalCenter">
          {!photos.length &&
            <p>No photos!</p>
          }

          {!!photos.length &&
            <Gallery
              onClose={() => this.setState({ photos: [] })}
              images={photos}
              width={window.innerWidth}
              height={window.innerHeight - 44}
            />
          }
        </div>

      </View>
    );
  }
});
```

### Next steps

We could keep going from here. We could display a list of images before,
and link them to the gallery. Reapp also has [docs on it's components](http://reapp.io/ui.html), so you can browse
and add them as you need. Good examples of Reapp code include the [Kitchen Sink demo](http://github.com/reapp/kitchen-sink)
and the [Hacker News App](http://github.com/reapp/hacker-news-app) they built.

### Check out the code

If you'd like to see our application you can [clone the repo we've put](https://github.com/reapp/demo-flickr).
It includes everything you need except a Flickr API key, which you'll want to sign
up for and insert before testing it out.

Steps to get the repo running:

1. Install [Node/npm](http://nodejs.org/), and Reapp: `sudo npm install -g reapp`
2. Clone the repo: `git clone git@github.com:reapp/flickr-demo`
3. Install dependencies: `npm install`
4. Start server: `reapp run`
5. View it in your browser at [http://localhost:3010](http://localhost:3010)

You'll probably want to explore the [Reapp getting started docs](http://reapp.io/start.html)
and the individual [UI widgets docs](http://reapp.io/ui.html) to keep you going.

Happy hacking!