So, here I am in 2026, writing my first "blog" post in about 9 years. It's
fascinating how so much has happened in 9 years, but one thing that I still see
is software engineers keeping personal sites with a blog. Blogging appears to
still be in fashion.

Side note, and maybe a large part of what brought me here, is the domain name
zachrburke.com. Sometime back in 2018 or 2019, a combination of an expired credit
card and total lack of due diligence on my part lead to me losing this domain.
I perhaps thought at the time that no one would want zachrburke.com so there was
no hurry to renew it. I thought wrong. Someone decided to grab zachrburke.com
and use it as a piece of disposable infrastructure to peddle unlicensed sports
betting.

So I was delighted to find out this week that zachrburke.com was back up for
sale. Although there might be a strong argument that I may not want it anymore.
Time will tell.

Anyway, I had to do some work to bring this thing back to life.

Rather than waste time building a new blog "engine", I decided to just fix the
rough edges of this one that I wrote 9 years ago. I really wanted to know how
hard that would be.  Given news of various compromised npm packages in 2025,
with the [Sha1-Hulud Supply Chain attack](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem)
and the general churn of javascript libraries and frameworks that happens in
the nodejs ecosystem (or should I say [deno](https://deno.com), or should I say
[bun](https://bun.com)?), I expected this to be kind of a pain.

So I wasn't shocked at all when running `npm audit` revealed over 100+ critical
vulnerabilities. Fortunately, past me decided that I didn't actually need to
use webpack to generate a static site.  There were still references to it though.
Deleting them, and updating the actual packages I used, like showdown and cheerio
got me to 0 known vulnerabilities pretty quickly.

After that, I decided to clean up a bit.  node has native typescript support
now, so I converted everything to typescript, added a simple type for a post so I
get better feedback when `build.ts` fails, and now we're golden. I'm keeping
the tradition of having a very strange approach to a blogging "engine", that is
essentially a handcrafted static site generator. I think it's fun and gives me
a space to experiment with web standards.

In the past I think I used to try various product analytics tools so I know if
people are reading. I'm trying [Post Hog](https://posthog.com/) for a product
I'm working on right now and it's pretty solid. In theory I could use Post Hog
here, but I've decided that it's best to not obsess over whether or not people
are actually reading anything here and instead to write for the sake of it.
That will at least help with the likely fact that no one is finding this blog
organically any time soon, given all the flags it has for illegal gambling on
the world cup in Qatar in 2022.

So what next? I want to write some more, and I have some other ideas that
I want to include on my site, like my collection of vinyls inspired by Andy
Bell's [music collection](https://bell.bz/music-collection/).

Some topics that I've had rattling around in my head that I want to get down,
maybe somewhat rapidly so I can push down those dreaded posts from 2017..
* Switching to nvim last year and my thoughts so far (this post is being
written in nvim).
* Covering some of the lessons learned in my year-and-a-half pickleball
simulator project (Maybe even start a devlog to show progress as it happens).
* My on and off again relationship with journaling and
[obsidian.md](https://obsidian.md/)
* Intersections between software engineering and construction.

