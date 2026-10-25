# Flesh and Blood Huntsman Hand Discovery Engine
## Locked Functional Specification v1.0

### Purpose

Build a search and analysis engine for **Flesh and Blood** that uses the existing **Talishar rules engine** to discover the highest-value hands and play patterns available to **Arakni, Huntsman**.

The system's purpose is discovery, not simulation of real games.

The system shall identify:

- Highest-value card combinations
- Highest-value resulting game states
- Best legal play lines
- Card contribution to outcomes
- Synergies between cards
- Structural properties of strong hands

The system shall not initially optimize complete decks, simulate a metagame, perform self-play, or train neural networks.

---

# Core Principle

The engine must remain as objective as possible.

The system shall avoid human assumptions such as:

```text
A Contract trigger is worth 3 points.
A card banish is worth 2 points.
An Arsenal is worth 5 points.
```

These values must be discoverable from data and evaluation models rather than hardcoded into the search system.

The search system shall record raw outcomes.

Separate evaluators shall determine how outcomes are valued.

---

# Project Scope

## Included

- Import legal card pool for Arakni, Huntsman
- Generate candidate hands
- Discover legal actions using Talishar
- Search legal play sequences
- Evaluate resulting game states
- Rank hands
- Rank play lines
- Track card usage
- Track card contribution
- Discover card synergies

## Excluded

### Phase 1 Exclusions

- Deck construction
- Matchup simulation
- Opponent AI
- Self-play
- Reinforcement learning
- Neural networks
- Meta analysis
- Genetic algorithms
- Multi-turn planning beyond configurable horizon

---

# System Architecture

```text
Card Pool
    ↓
Hand Generator
    ↓
Talishar Rules Engine
    ↓
Legal Action Generator
    ↓
Search Engine
    ↓
State Recording
    ↓
Evaluation Layer
    ↓
Results Database
```

Talishar remains the authoritative source for:

- Card rules
- Legal actions
- Resource usage
- Costs
- Timing
- Combat chain
- Hero abilities
- Equipment abilities
- Contracts
- Banish mechanics

No card rules shall be duplicated outside Talishar.

---

# Hero Definition

Initial implementation targets:

```text
Hero:
Arakni, Huntsman
```

Legal card pool consists of:

```text
All Assassin cards legal for Huntsman
All Generic cards legal for Huntsman
All legal equipment
```

Legality shall be imported from the source card database.

---

# Search Objective

The engine shall answer:

> Among all legal Huntsman card combinations, which hands generate the strongest resulting game states after optimal play?

The engine is optimizing:

```text
Resulting State Quality
```

not

```text
Raw Damage
```

---

# Hand Definition

A Hand consists of:

```text
4 cards
```

Optional future support:

```text
Arsenal state
Equipment state
Hero state
```

Initial state:

```text
Empty arsenal
Ready equipment
Standard Huntsman board state
```

---

# Hand Discovery Mode

The system shall discover hands.

The system shall not require a decklist.

The system shall not rely on random draws.

The system must be capable of generating candidate hands directly from the legal card pool.

---

# Search Engine

The search engine shall:

```text
Generate legal actions
Apply action
Generate new state
Repeat
```

using Talishar.

The search engine shall not brute-force all possible action trees whenever pruning is possible.

---

# Pruning Requirements

The engine shall eliminate inferior states whenever possible.

## Dominance Pruning

If State A is equal or better than State B in all tracked dimensions:

```text
Damage
Cards retained
Arsenal
Resources
Contracts
Etc.
```

Then State B is discarded.

---

## Duplicate State Elimination

If two action sequences produce the same resulting state:

```text
Keep one.
Discard duplicates.
```

The engine searches states, not histories.

---

## Beam Search

The engine shall support beam search.

Example:

```text
Generate 1000 states.

Keep best 100.

Expand only those.
```

Beam width must be configurable.

---

# State Representation

Each state shall record:

```text
Hero life

Opponent life

Cards in hand

Cards played

Cards pitched

Cards blocked

Cards arsenaled

Cards banished

Contracts completed

Resources generated

Resources spent

Floating resources

Action points

Equipment usage

Known opponent information

Combat chain status
```

---

# Outcome Recording

The engine shall store raw outcome data.

Example:

```text
Damage Dealt: 7

Contracts Completed: 1

Cards Banished: 2

Cards Remaining In Hand: 1

Cards In Arsenal: 1

Resources Generated: 3

Resources Unused: 0
```

Raw values are never converted automatically into point values.

---

# Card Usage Tracking

For every card the system must record how it was used.

Possible usage types:

```text
Played

Pitched

Blocked

Arsenaled

Retained

Unused
```

Example:

```text
Card: Blue XYZ

Played: 2%

Pitched: 96%

Blocked: 1%

Arsenaled: 1%
```

This prevents resource cards from appearing artificially powerful merely because they are frequently included.

---

# Contribution Analysis

Presence alone is insufficient.

The system shall measure card contribution.

For every high-value hand:

```text
Evaluate Original Hand

Remove Card

Re-evaluate

Measure Outcome Difference
```

Contribution is defined as:

```text
Outcome Delta
```

The goal is to distinguish:

```text
Card was present
```

from

```text
Card created value
```

---

# Role Discovery

Card roles shall not be manually defined.

The system shall discover roles statistically.

Examples of emergent roles:

```text
Resource Card

Starter

Finisher

Contract Enabler

Payoff

Utility

Block Piece
```

Roles are outputs of analysis, not inputs.

---

# Synergy Discovery

The system shall identify:

```text
Card A + Card B

produces outcome stronger than expected from either card alone
```

The system shall calculate:

```text
Pair Synergy

Triple Synergy

Recurring Combination Frequency
```

for top-performing hands.

---

# Evaluation Layer

The evaluation layer shall be separate from the search layer.

Search layer responsibilities:

```text
Find legal outcomes.
```

Evaluation responsibilities:

```text
Determine value.
```

These systems must remain independent.

---

# Initial Evaluation Model

The evaluation framework shall support plug-in scoring models.

Examples:

```text
Aggressive

Midrange

Control

Fatigue

Neutral
```

The search engine must function regardless of evaluator.

---

# Data Storage

Every analyzed hand shall store:

```text
Hand ID

Cards

Best Play Line

Resulting State

Raw Statistics

Score

Card Usage Data

Card Contribution Data
```

---

# Required Outputs

The engine must be capable of producing:

## Best Hands

```text
Top 100 Hands
```

ranked by evaluation score.

---

## Best Play Lines

```text
For a given hand

Best legal sequence

Alternative sequences

State outcomes
```

---

## Card Ranking

```text
Most impactful cards

Most pitched cards

Most played cards

Most contributed cards
```

---

## Synergy Ranking

```text
Best card pairs

Best card trios

Highest-value recurring structures
```

---

# Success Criteria

Version 1 is considered successful if it can answer:

### Question 1

```text
What are the highest-value 4-card hands available to Huntsman?
```

### Question 2

```text
What is the best legal line from each hand?
```

### Question 3

```text
Which cards genuinely create value versus merely act as resources?
```

### Question 4

```text
Which combinations repeatedly appear in high-value outcomes?
```

### Question 5

```text
What structural patterns exist among elite Huntsman hands?
```

---

# Non-Goals

The following are explicitly out of scope for Version 1:

```text
Building optimized decks

Predicting tournament results

Meta analysis

Matchup-specific planning

Opponent modeling

Reinforcement learning

Neural networks

Large-scale self-play

Automated deck evolution
```

These may be considered future extensions but are not part of this specification.

---

# Final Design Philosophy

The engine exists to discover truths already contained within the rules of Flesh and Blood.

Human assumptions should be minimized.

Talishar defines legality.

The search engine discovers possibilities.

The evaluation layer determines desirability.

Statistical analysis discovers card roles, synergies, and patterns.

The system is intended to function as a Huntsman position-analysis and hand-discovery engine analogous to how a chess engine analyzes positions, with the long-term goal of revealing optimal play structures that are not obvious through human intuition alone.