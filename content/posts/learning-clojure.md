I recently stumbled across [this](https://www.youtube.com/watch?v=xzTH_ZqaFKI) video of "someone" (would love to know more about the author of the video) live coding in [common lisp](https://common-lisp.net/). In about 15 minutes, he "codes" a song and visually outputs what notes are being played on the screen as he is writing. What impressed me is that he could do this without having to refresh or rebuild anything. At most, you will occassionally see him highlight a method and run it through a [REPL](http://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop).  

This video piqued my interest in functional programming languages. In .NET, I've come to enjoy using lambda expressions and LINQ statements, which are a means to write [functionally](http://www.codeproject.com/Articles/375166/Functional-programming-in-Csharp) in C#. One thing I can't do in C# is start up a program and actively modify it while it's running. I decided to start sifting through the functional languages that were at my disposal.

Before doing that though, I wanted a concrete problem to solve. When someone asks me what to write when learning a new language, I say start with "Hello World." After pointing out they already thought of that, I suggest writing a twitter bot. Doing this allows you to see, in your new language of choice, how you would tackle http requests and some kind of algorithim depending on what you would have your twitter bot do. I decided that I wanted to write a twitter bot that would tweet something random every hour.

As Heroku tends to be my goto for this kind of project, I looked at what functional languages it supports without the need for any custom buildpacks. Clojure pops up on the list as the lone item in this category, so I decide to roll with that.

Like many other bots, I took inspiration from [horse_ebooks](https://twitter.com/horse_ebooks) and named my bot `zach_bebooks`. I wound up using the [twitter-api](https://github.com/adamwynne/twitter-api) library by [Adam Wynne](https://github.com/adamwynne). My original plan was to hit the twitter api manually using [clj-http](https://github.com/dakrone/clj-http). However, learning the payloads that return from twitter, as well as figuring out how to generate an oauth signature and how to insert and parse JSON for a rest request/response proved to be a lot to learn alongside a new language.  

I let heroku take care of the scheduling by using the [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler). Borrowing some logic from [Diego Basch's blog](http://diegobasch.com/markov-chains-in-clojure-part-2-scaling-up), I was able to do a crude Markov Chain implementation, allowing `zach_bebooks` to speak.

![zach_bebooks](http://i.imgur.com/OcRFviQ.png)

For the random sentence generation to work, I needed data. I created a makeshift persistence engine by storing the data used to generate markov chains in an atom. I actually loaded the data that is used now by running the program inside a repl and calling `learn-files` on directories loaded with text files.  

The full source code for `zach_bebooks` can be found [here](https://github.com/zach-binary/zach_ebooks).  

I'm happy to say I think I achieved my goal of writing a twitter bot without having to hack anything (with the exception of `learn-files` where I return "Complete" to keep all the newly learned data from getting dumped to the REPL). It surprised me how difficult it was to write functionally without an imperative crutch. Concepts like appending to a list during a loop took what felt like an eternity to grasp because I'm now working with immutable data structures.

    (defn gen-sentence
    []
      (let [corpus (deref corpus/data)]
        (loop [phrase [] word (start-chain corpus) n 0]
           (if (> n phrase-length)
              (clojure.string/join " " phrase)
           (let [next-word (get-next-word corpus word)]
              (recur (conj phrase next-word) next-word (inc n)))))))
   
This is the function `zach_bebooks` uses to speak. It gets the data (data being a persistent hash map of words and follow-ups to those words) from an atom (`corpus/data`). If we pass the length of our phrase, 20 words in this case, then it packs together the vector `phrase` into a string and returns that. Otherwise, it "calls" the loop again with a newly created vector that is a combination of the old vector and the recently selected word.  

One thing about clojure in particular is that [it takes awhile for the REPL to start](http://martintrojer.github.io/clojure/2014/04/05/the-clojure-repl-a-blessing-and-a-curse/). Despite the time it takes a REPL to start, the ability to reload code in a REPL session let me keep a single REPL going for a real long time. After getting past some of the nuances of Clojure, it didn't take long to feel the realization that [code is data](http://java.dzone.com/articles/code-data-data-code) (I say this but I didn't use any macros :)).  

