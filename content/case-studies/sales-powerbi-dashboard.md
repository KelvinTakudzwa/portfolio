# Sales Overview: Power BI Dashboard

**Node:** 03 · Core · Data/BI breadth

## One-line

A star-schema sales analytics dashboard turning raw transaction and budget
data into revenue, geography, product, and customer-segment insight,
budget-vs-actual included.

## Approach

Proper dimensional modelling rather than a flat report: a Calendar dimension
for time-based analysis, Customer (demographics/segment) and Product
(category/classification) dimensions, and an Internet Sales fact table
carrying revenue and profit metrics. A separate sales-budget input feeds
variance analysis against actuals.

Power Query handles transformation/cleaning; DAX carries the custom measures
(trends, profitability, budget variance). Both CSV and SQL sourcing paths are
supported, so the model isn't locked to one ingestion method.

## What it shows

- Revenue trends over time, filterable by period
- Geographic performance breakdown
- Product profitability and volume
- Customer demographic segmentation
- Budget vs. actual variance

## Stack

Power BI Desktop · Power Query · DAX · SQL

## Why it's here

Shows the data/BI side deliberately separate from the ML work: dimensional
modelling and stakeholder-facing reporting is a different skill from training
a classifier, and recruiters filtering for "can this person do analytics
work independent of a research project" should see it as its own node, not
buried under the solar dissertation.

## TODO before publishing

- [ ] Context: was this coursework, an internship deliverable, or
      self-initiated? Changes the framing.
- [ ] Any real (anonymised) business this modelled, or fully synthetic data?
- [ ] Screenshot(s) of the actual dashboard for the case-study page
