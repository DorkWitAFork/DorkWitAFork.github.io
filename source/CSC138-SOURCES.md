# CSC 138 network-layer additions

## Scope and sequence

Chapter 4 retains the original 13 lesson IDs and eight activity IDs. Six appended
lessons finish the supplied data-plane material, giving 19 lessons, 15 activities,
and 42 quiz questions. Chapter 5 adds nine lessons, nine activities, and 18 quiz
questions based on the first two lecture decks; textbook sections 5.1–5.2 support
those lessons. Roadmap-only protocols are not presented as completed lessons.

| Source | Lessons / practice |
| --- | --- |
| Chapter4-Data Plane-IP-Addressing-Problem.pdf | Aligned subnet allocation, usable capacity, host/broadcast ranges |
| Chapter4-Data Plane-NAT-IPV6.pdf | NAT mappings, IPv6 header sizing, inner/outer tunnel endpoints |
| Chapter4-Generalized-Forwarding-Middleboxes.pdf | Flow matches/actions/priorities/counters; middleboxes, IP hourglass, end-to-end argument, NFV |
| Chapter4-Generalized-Forwarding-Middleboxes-Problem-Review.pdf | Typed NAT trace, tunnel-header analysis, constrained flow-rule construction |
| Chapter5 - Link State Algorithm.pdf | Control structures, weighted graphs, Dijkstra trace, predecessor/next-hop table, complexity |
| Chapter5 - Distance Vector Algorithm.pdf | Bellman-Ford candidates, synchronous DV rounds, cost-change trace, LS/DV comparison |
| Chaptert 4 - Computer Networking, EBook, Global Edition.pdf | Supporting sections 4.3.2–4.5, especially NAT, IPv6, generalized forwarding, architecture |
| Chaptert 5 - Computer Networking, EBook, Global Edition.pdf | Supporting sections 5.1–5.2 (printed pp. 408–425); poisoned reverse is identified as textbook support |

## Source clarifications

- The subnet-review answer `.32/26` is unaligned: a /26 boundary within a /24 is
  a multiple of 64. The fresh-allocation exercise packs the larger /26 first,
  then the /27, and explicitly states that router interfaces are counted.
- DV slide 18's equations give c's first-round distance to e as 2 and to d as
  infinity; the printed vector appears to swap those entries. The lesson follows
  the equations/topology and calls out this discrepancy.
- IPv6 has no **router** fragmentation; sources may use a fragmentation extension
  header. Its Payload Length excludes the 40-byte base header.
- The simple Dijkstra implementation is O(n²). Message dissemination counts have
  separate assumptions: the slide's efficient-broadcast model versus general
  flooding bounds involving the number of links.
- Historical IPv6 adoption figures are not presented as current statistics.

## Exercise behavior

`NetworkWorksheet` checks each field on submission, tolerates case/outer spacing,
provides hints and worked solutions, and gates activity completion on a successful
check. Solutions are available for self-study and do not automatically award
completion. Dijkstra breaks ties alphabetically; any changed answer invalidates
the checked step. DV uses an immutable previous-round snapshot for all routers.
The shared six-node topology allows comparison of both algorithms' results.

Saved completion IDs remain valid. Older Chapter 4 quiz records keep their original
denominator; new Chapter 5 quiz progress is backfilled without resetting prior work.
All new routes also work through the legacy `/csc138/` redirect.
