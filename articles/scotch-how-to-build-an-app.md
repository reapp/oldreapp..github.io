## Creating a Native app with React, Flux and Reapp

React is enabling frontend developers to build apps like never before. It makes
them both easier to reason about, and much faster. [Reapp](http://reapp.io) was
created to take advantage of these huge productivity and performance advantages.

But, React is just one piece of building a complete app. Reapp provides us with
an easy way to start out and all the user interface elements we need. But, what about
Flux?

Today, we're going to create an app using Reapp, Immutable data structures, and Flux.
Not familiar with these terms? We'll cover the importance of each as we go.

### What we'll be building

![]()

### Starting out

With node installed, lets run `sudo install reapp -g` to install the Reapp CLI.
Once that installs, run `reapp new flickrapp`. Finally, `cd flickrapp` and `reapp run`.

You should see this:

![]()

Now you can head to [localhost:3010](http://localhost:3010) and check out your app.

**Tip: In Chrome, [enable mobile device emulation](https://developer.chrome.com/devtools/docs/device-mode) to
view your app as a mobile app**

![]()

Alright! Now we're fully set up with React. Let's dive in and begin fetching data from Flickr.
Open up `./app/components/Home.jsx`.