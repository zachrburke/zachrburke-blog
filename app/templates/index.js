import post from './post';

function $each(list, callback) {
    return list.map(callback).join('');
}

function $if(condition, callback, elseCallback) {
    if (condition)
        return callback();
    else if (elseCallback)
        return elseCallback();
        
    return '';
}

export default {
    header: () => {
        return `
            <header>
                <nav>
                    <a href='/'>
                        <img class='logo' src='/content/images/vomit_fountain.png' />
                    </a>
                    <h3>
                        <a href='/'><span class='glitch'>throw up</span>;<span class='blink'>_</span></a>
                    </h3>
                    <a href='http://feeds.feedburner.com/ThrowUpRss' target="_blank">
                        <img class='feedicon' src='/content/images/feed.png' />
                    </a>
                </nav>
            </header>
        `
    },

    post: post,

    footer: () => {
        return `
            <footer>
                <p>
                    &copy; Zach Burke &middot; made with 
                    <a href='http://leafo.net/lapis'>lapis</a> &middot; 
                    <a href='http://github.com/zach-binary/throw-up'>source</a> 
                </p>
                <p>
                    &middot; follow me &middot;
                    <a href='http://twitter.com/zach_no_beard' target='_blank'>
                        <i class='icon-twitter'></i>
                    </a>
                    <a href='https://github.com/zach-binary' target='_blank'>
                        <i class='icon-github'></i>
                    </a>
                    <a href='http://ren.itch.io' target='_blank'>
                        <img src='/content/images/itchio_icon.png' />
                    </a>
                    <a href='http://feeds.feedburner.com/ThrowUpRss' target="_blank">
                        <img src='/content/images/feed.png' />
                    </a>
                </p>
            </footer>
        `
    }
}