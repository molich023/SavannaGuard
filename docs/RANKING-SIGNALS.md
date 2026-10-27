# Savanna Search Ranking Signals

The supplied chapter describes text, anchor, URL, click, query classification, link citation, link popularity, freshness and preference signals. fileciteturn2file0L27-L55

| Signal | v0.6 treatment | Reason |
|---|---|---|
| Title term match | strong | direct relevance |
| Body term match | moderate | broader recall |
| Phrase match | moderate | intent/proximity proxy |
| URL term match | moderate | semantic hint |
| Anchor text | moderate | external description |
| Authority | bounded | link-based quality |
| Freshness | bounded | time-sensitive queries |
| Africa relevance | bounded | product identity, not exclusion |
| Language match | bounded | query comprehension |
| Source quality | bounded | curated quality controls |
| Spam | penalty | abuse resistance |
| Click data | deferred | privacy + manipulation risk |

A page should not receive a large score merely because it contains many repeated keywords. The source warns that visible and hidden keyword fields can be abused by spammers. fileciteturn2file0L28-L35

Authority should eventually be computed from the link graph rather than raw inbound-link count alone because simple in-degree can be vulnerable to link spam. fileciteturn2file2L129-L156
