---
title: Database Export Security Issue Disclosure
tags: ['security']
authors: ['nbudin', 'dkapell', 'jaelen', 'jcooke']
---

Hi larp community! A thing happened that we should tell you about. You're receiving this because you've logged into at least one convention website running in NEIL Hosting (Intercon, Be-Con, Festival, Bubble, etc).

While reviewing the code in the Intercode open source project, we discovered a backup of the Intercode production database. This backup was publicly available for about 6 weeks between September 18 and November 3, 2022.

We do not store payment card data in this database. In addition, we use industry-standard password hashing to protect passwords. **Nevertheless, we recommend that you change your password as a precaution. To change your password, please visit: https://www.neilhosting.net/users/edit**

We do not have any evidence that this data was accessed, and we have taken steps to remove it from the Internet. However, we also have no way to prove that the data was not accessed.

<!--truncate-->

## What data was publicly accessible?

- Information in User Profiles for all conventions hosted on this instance, which may include names, addresses, phone numbers, email addresses, birth dates (if provided), etc:
  - These conventions include but are not limited to: Intercon, Festival of the LARPs, Bubble, SLAW, Summer Larpin', Be-Con, NELCO, Winter Boffer Con, Wintercon, and others. Refer to https://www.neilhosting.net/pages/all-conventions for a more complete list.
- Encrypted passwords for all user accounts. Passwords are hashed and salted using the industry-standard bcrypt algorithm.
- Event proposals, signups, dropped events, individual event ratings (starred/hidden events), and all other data used in the signup system for Intercode-hosted conventions.
- Historical data from past conventions, including previous addresses, names, phone numbers, and anything else attendees might have entered into profiles and not updated on that convention site.
- Lists of user activity alerts set up by admins of current and prior conventions.
- Sales records for tickets and merchandise at current and past conventions.

## How did this happen?

Prior to resetting the Intercon U signups and schedule, Nat took a manual export of the full database for safety. This is outside our standard backup procedure, which uses Amazon's automated database snapshot feature and stores backups in a separate secure environment.

The manual export file stayed on Nat's computer while he developed the COVID mask protocol features for Intercode that we're currently using at Intercon U. When checking the new code into the repository, Nat accidentally included the export.

The day before Intercon U signups opened for the first round, while reviewing unrelated code in preparation for the signups opening, Nat noticed the file on Github and immediately began taking steps to remove it.

## What are we doing about this?

We have purged all known copies of this file from the public Internet. We've also reached out to the Consequences web team, who we believe accidentally received this file as part of their regular Intercode releases, and asked them to purge it from their systems. We also searched some of the places on the Internet where stolen data often appears to see if the Intercode export may have ended up there, and weren't able to find it.

We've also added some additional protections to our code repository and data export process to make it much less likely that a similar incident could occur in the future.

We held a post-mortem meeting to discuss this incident and document it. The meeting notes are available at: https://docs.google.com/document/d/1hcVCF9wzqpTevZPlImRUjhTONp4hFqgjcQhWER4Ao7M/edit?usp=sharing

We're also sending this email to all Intercode users to let them know. **Again, we recommend that you change your password using the link above.**

We recognize the potential severity of this data exposure. We'd like to apologize deeply. We understand the importance of data security, and we should not have allowed this to happen. Transparency is important to us, and if you have any questions about this, we'd be more than happy to chat with you.

Nat Budin (he/him)<br />
Dave Kapell (he/him)<br />
Jae Hartwin (crow/crows)<br />
John Cooke (he/him)
