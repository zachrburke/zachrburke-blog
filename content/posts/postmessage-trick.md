Are you working on a single page application that needs to be embedded in an iframe?  Did you have to give control of that iframe back to the parent because it too was a single page application?

First off, I'm sorry, but there's good news!  You can use window.parent.postMessage to send messages up to any pages embedding your application.  The parent page can subscribe to that message and take whatever action it needs to take after a user has completed something in your embedded application.

The nice thing about this is it makes our application more generic, meaning it won't need to change because a new client wants to consume it using an iframe!

Here's an example:

```js
// framed code
window.parent.postMessage("finished!", '*');

// parent code
window.addEventListener('message', function(event) {
    
    // make sure the message is coming from where you expect!
    if (event.origin.includes('my-own.domain.com') {
        document.querySelector('iframe').remove();

        // do things now that the user is done
    }
});
```

## Gotchas

First off, if you're in React, don't forget to keep track of your listener id so you can remove it when your component unmounts.  If you don't do this, you run the risk of your message getting handled multiple times for each time your component mounts.

```jsx
class MyFrame extends Component {
    constructor(props) {
        super(props);
        this.state.finished = false;
    }

    componentDidMount() {
        this.listenerId = window.addEventListener('message', (event) => {
            if (event.origin.includes('my-own.domain.com') {
                this.setState({ finished: true });

                // do things now that the user is done
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener(this.listenerId);
    }

    render() {
        return !this.state.finished ?
            <iframe src="https://my-own.domain.com/app" /> :
            <div />
    }
}
```

Secondly, if you want to hide the frame right after your message is published, you may see that your iframe has this flicker effect if it still has content inside of it.  As the maintainer of the framed application, assuming you can't just get rid of the content, you can get around this problem by using css transitions.

```css
.finished {
    animation: 400ms fade-in;
}

@keyframes fade-in {
    0% { opacity: 0%; }
    100% { opacity: 100%; }
}
```

This will actually cause the message to be published and processed first, and transition to come second.  Meaning your client can hide your iframe before you get a chance to change state, eliminating the flicker.