This architecture leverages CQS, command query separation, where the command
always writes one or more events, or a failure. The query is a list of events,
often projected onto a view that's presented in a human readable format.  This
view could be as simple as an object in memory, passed to a renderer that
interpolates fields into an html document. A view can be as complicated as
a set of rows persisted to a table in a postgres database, to solve for
sub queries of long lists of entities based on their projected traits. Different
projections require different kinds of designs.

## Commands and Decision State

A command is a way to write events to the system. At a minimum, without considering
what kind of event we want to write, a command must include the following.

1. `RecordedAt` - The time of the command, or when the event was written.
2. `Who` - The person or principal responsible for this command
3. `StreamId` - The id of the stream where this event will be appended.  This
   can also be thought of as an identifier for an "entity". Think hard on this
   one, it influences a lot of decisions that will affect scale, robustness,
   and ease of use.  More on this one later.
4. `Kind` - A string to identify what kind of command is being written.  Useful
   for matching expressions.

Other optional fields that are useful to consider in a command are

1. `OcurredAt` - The time the event happened when different from the time it
   was recorded.  Useful when backfilling something missed in the past, or
   for an event that will happen in the future.
2. `Source` - The "location" where the command was sent from. An example might
   be the url of a web page where the command was sent from. Useful as a quick
   analytical tool

Of course, none of this is useful without the actual event data.  The opinion
here is to include any data needed to write the event as first class fields
when using an object oriented language. The option exists to represent data as
a set of key-value pairs, but this option should only be used for events that
don't require any special kind of "machinery".  Meaning, nothing is done to
project this data anywhere, it's simply being copied so it can be presented
somewhere else.  This might sound like CRUD over events, however there are
cases where someone may be required to submit a long complex form where the
data is important because it is being viewed by another human somewhere else,
but may not be meaningful when constructing a view. An example might be
charting a patient for an EHR system.

Something else to consider when writing a command is *decision state*.  This is
a term for state that is compiled for a single stream, to validate if an event
should be written according to it's data.

Before talking about the application of this, it's important to consider
failure modes where a command may produce unwanted events. It's rarely a case
of the "wrong data" being entered in somewhere, as that can often be handled in
real time with a UI in front of a user. The failure modes we're interested in
live in between UI validations and are often related to concurrent writes.

Take for example, a business is allowing pre-order of an item that has an
upfront limited quantity that is known before it's release date. Say this
business has a store alone, and that store only has one register.  In that
case, there would be no problem, you could design an event such as
`ItemHeldForCustomer` that now proves a certain customer holds that item, and
it can write to the stream for that item that decrements it's allocation so we
have an accurate count of how many more pre-orders we can allow.

Now we can add a second register to complicate things, but instead of doing that,
let's skip to a different consumer altogether, online.  Say someone online wants
to pre-order that item, and pick it up at that specific store. Not only is that
a competing consumer for the same allocation, but the consumers are no longer
visible to one another.

To resolve conflicts like this, commands should be read in a queue. In .NET,
this maybe implemented as a queue of task completion sources, so that waiting
on your item to be processed in the queue, can also allow for feedback to the
consumer that attempted to write the command.  This adds flavor to the typical
"fire and forget" command pattern. It's "fire, check and see if it passes
validation, then forget".

In our example, with a queue of commands, we might produce a task completion
with a failure and a message saying "allocation empty" that tells the unfortunate
loser in the race that they will have to go about acquiring their item at a
different store, or though another means.  Given the competing consumer problem
is mostly solved, the possibility is opened up to allow one store to reserve
safely on behalf of another.

Another benefit of this task completion source approach is better feedback in
the happy path.  If someone is looking at a view that is impacted by their
requested command, they can see their own writes immediately.  This simplifies
the often complicated mechanism required in most CQS architectures.  Often
a set of notifications is required before a view can safely be refreshed to
show some kind of change, but for a lone user operating on a singular view,
it's possible to show them the impact of their change in a single syncronous
request.

The drawback of this approach is it can have performance implications for a
stream that is "hot" and receiving a lot of traffic. It's worth noting
that this performance bottleneck would have to be quite severe, as writes
are simply appending events to a stream, which is often very fast.  It's
unclear how enormous load must be on a system in order for users to see a
very long wait time.



