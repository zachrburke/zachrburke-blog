export default function(post) {
    return `
        <section>
            <div class='metadata'>
                <h4>${post.title}</h4>
                <small>Published ${post.pub_date}</small>
            </div>
            <article>${post.body}</article>
        </section>
        <aside>
            <section class='about'>
                <h5>About Me</h5>
                <hr/>
                <p>
                    I am a .NET developer that likes to tinker in lua and other languages.  I make games too!
                    <a href='/me/about'>read more</a>
                </p>
                <ul>
                    <li>
                        <a href="http://feedburner.google.com/fb/a/mailverify?uri=ThrowUpRss&amp;loc=en_US" target="_blank">Get email updates</a>
                    </li>
                    <li>
                        <a href='http://feeds.feedburner.com/ThrowUpRss' target="_blank">
                            RSS Feed <img class='feedicon' src='/content/images/feed.png' /> 
                        </a>
                    </li>
                </ul>
            </section>
            <section>
                <h5>Archive</h5>
                <hr />
            </section>
        </aside>
    `
}