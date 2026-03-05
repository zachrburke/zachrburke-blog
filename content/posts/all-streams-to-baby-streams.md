Back in 2021, event sourcing was a concept I had read about but never put into practice.  I was looking for an opportunity to try it out and at [kaizen.io](https://kaizen.io) I got my chance in the construction domain for an erosion control company.

My first event sourced system tried to test the boundaries of storage and time by storing all events in a single stream.  Don't ever do this.  At the time I thought the number of events for a single division would never be big enough for it to matter.  The problem is if all the events are tangled together, then you have to read about year-old events to understand what's happening right now.  Both fortunately, and unfortunately for me, this system still proved to be very useful, and I was stuck supporting this very awkward model.

I had thought for some time I was stuck in this reality, but after some deliberation (perhaps years of deliberation) I saw a way out.  To understand the answer, I have to explain lifetimes.  An event by itself can live on indefinitely, and that's fine.  What may not live on is the thing that event happened to.  A work order may have been completed a year ago, and it's separate from today's work order, so I don't need to look at both to understand today's work order.  If I take this further, I may not care about year-old work orders altogether, and can safely delete or archive them away to some other form of persistence altogether, like a PDF of the final state sitting in cold storage.

A lifetime is the answer to the question, "how long do I want to keep this thing around?", or "how long is this relevant?"  These are questions you should always be asking when you're choosing events.  Before we can ask this question, another more important question needs to be asked.  "What is this happening to?" Is it a work order, a cart, a residential subdivision?  In the all-stream case, there was no "what", or perhaps the "what" could be the entire world, which is its biggest drawback.  In truth, every event *did* have some kind of identifier associated with it, which was key in digging out of my hole.

Individual lots had identifiers, so I knew how to look up the material counts for particular addresses.  These lots each have bids tied to them so that identifier is very important!  Lots belong to a community which has an identifier.  When a crew was assigned to visit that subdivision, that assignment had its own identifier.

I've had the fortune of learning from this mistake in future projects and created event models where every event has a distinct `StreamId` to identify the "what" it belongs to.  In the examples I listed above, this "what" already gets tricky even if I had known this from the start.  Domain-driven design has terminology for this, but I find it simpler to think of entities that can have children, and those children can have children.

My approach to modeling this relationship in the identifier is to simply make the id reflect it in a straightforward way.  So if I wanted to know about lot 212 in community 2 for customer 12, then I would get all the events for `community/12-2/lot/212`.  A nice little resourceful name.  This gives us the benefit of being able to query the events for a specific lot, or all of those events for the subdivision.  There are cases where we want to follow the lot, but we are also providing analytics at a community level, so it's important we can do both.

So from here, my solution finally reveals itself.  I don't need to do a big migration or modify my event schema, or at least not the events directly.  I simply need to add some metadata based on the event data that helps me identify the "what" for each event.  I'm lucky those identifiers already exist.  Here's how I do that:

```c#
return @event switch
{
    // Lot-related events
    LotServiced e => $"community/{e.CustomerId}-{e.CommunityId}/lot/{e.LotId}",
    InstallmentBilled e => $"community/{e.CustomerId}-{e.CommunityId}/lot/{e.LotId}",

    // Assignment-related events (use assignment ID as stream)
    CrewAssigned e => $"assignment/{e.AssignmentId}",
    CrewAssignmentRemoved e => $"assignment/{e.AssignmentId}",
    WorklogSubmitted e => $"assignment/{e.AssignmentId}",

    // Community-level events
    CrewDispatchedToCommunity e => $"community/{e.CustomerId}-{e.CommunityId}",

    // Purchase Order events (EPO is a type of purchase order, so they share the same stream)
    PurchaseOrderReceived e => $"purchase-order/{e.Id}",
    EpoCompleted e => $"purchase-order/{e.Id}",

    _ => throw new ArgumentException($"Unknown event type: {@event.GetType().Name}")
};
```

Using this to add a `StreamId` to new events, plus an additional batch update to existing events to include this new field was fairly straightforward.  That is because nothing about the system changes aside from some extra storage.  I still depend on reading the full history of events to build my views today, but this provides the mechanism to get away from that.

Even before adding new view builders that use the `StreamId`, this had a unique operational benefit.  If I knew anything about a community that was having problems, it was easy for me to query all the events for a community.  Beforehand, it was surprisingly difficult and often required me having to write a throwaway application just to see the events.

These events live in a Postgres database as a single table.  It's straightforward to get all the events for a lot or an assignment, but what about a community?  I do consider lot serviced to be events on the community and that is probably one of the most important use cases.  It turns out a `LIKE` query here works very well given the predictable nature of our `StreamId`.  By itself, a query like `community/2-12/%` can take seconds if there are over 2 million events in the table!  Luckily, a cheap index brings this down to milliseconds.

```sql
CREATE INDEX idx_community_maintenance_events_stream_pattern
ON community_maintenance_events(stream_id varchar_pattern_ops);
```

This index treats the `StreamId` as a set of raw byte values.  By doing this, it can use a b-tree lookup to find the exact range of values, or entities in this case, that fall between `community/2-11/` and `community/2-13/` rather than scanning the entire table and checking for every entry that matches the pattern.

I still depend on the all-stream today, but I have pulled pieces of functionality away from it that now leverage these "baby streams" and I'm much happier with how these re-writes are working. Maybe in the next year, I'll be done with the all-stream altogether.
