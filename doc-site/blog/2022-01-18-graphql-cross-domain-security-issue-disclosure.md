---
title: GraphQL Cross-Domain Security Issue Disclosure
tags: ['security']
authors: ['marleighnorton', 'nbudin', 'dkapell', 'jaelen']
---

Hey all. This thing happened we should tell you about.

While performing platform upgrades, we found a bug in Intercode, the website code used by conventions such as Intercon. It has since been fixed.

This bug created an exploit where people with leadership access to one Intercode convention could use certain permissions on any convention. As a reminder, not even admins have access to your passwords or financial information.

Due to the technical complexity of accessing the exploit and the small number of people who had the permissions required to take advantage of this, we don’t think it was used, but can’t prove it.

<!--truncate-->

## What Happened?

It’s technically possible con leadership from one convention looked at or modified information for conventions they should not have had access to. We don’t think anyone did, and it’s since been fixed, but here’s the low down.

There’s a function called “Become user” which certain people on the convention team have permissions for. Just like it sounds, it lets people see the convention website as if they were logged in as the selected user. It’s used for things like running the convention, debugging, and accessing the website on behalf of a user at their request. It does not allow access to anyone’s passwords or payment information.

This permission is fairly restricted and convention specific. That being said, if you had Become user permissions on one convention using Intercode, it turns out there was a way to then Become user on any Intercode convention. It would involve coding and would not be easy, but it was possible. For example, someone with admin access to Intercon S could have accessed admin functions on Be-Con 2019, including viewing and modifying event and attendee data.

## What Are We Doing About This?

The bug has been fixed and the exploit is gone. We’ve also reviewed the list of people who have Become user permissions on any Intercode site. Considering the difficulty of finding the exploit, the technical expertise required to use it, and the limited set of people who have the necessary permissions, we think it’s really unlikely anyone did so. That being said, we can’t prove a negative.

A post-mortem was held to document the exploit, which you can find at: https://docs.google.com/document/d/1Ov8jFIpExWn-elUBXtRd22BwoIQGSbWMFio_iTL9IRM/edit?usp=sharing. It includes timelines and technical details for the interested.

And of course, we’re now telling you about it. We take the safety and security of our community very seriously, which means owning up to our mistakes. We apologize this happened at all, and we're even more sorry it took us so long to notice it.

Thanks for your faith in us.

The Intercode Team<br />
Nat Budin (he/him)<br />
Dave Kapell (he/him)<br />
Jae Hartwin (they/them)<br />
Marleigh Norton (she/her)
