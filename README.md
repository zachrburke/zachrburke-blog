# Personal Blog
Version 2 of my personal blog for http://zachrburke.com

Rather than leverage something like [Astro](https://astro.build/) like a sane
person, I would much rather stitch together tools to build my own static site
generator from scratch.  My rationale is if the content of this blog is
primarily technical, then having a playground that allows me to experiment with
things like the web platform [with towels instead of
mitts](https://marrowprivatechefs.com/post/why-chefs-use-towels-not-oven-mitts).

I recently made a bunch of changes that you can read about
[here](https://zachrburke.com/blog/revival)

## Running

```bash
npm i
npm run dev
```

This will allow building the site in watch mode with `nodemon`.

You can view the site by running `npm start`. This uses `http-server` to serve
the files locally.  As of right now, there is no live reload (maybe in the future).

## Hardcover

Book progress is pulled from the [HardCover API](https://docs.hardcover.app/api/getting-started/).

In order for that to work, you will need to export your hardcover token before running `npm run dev`.

```bash
export HARDCOVER_TOKEN=Bearer <your actual bearer token>
```
