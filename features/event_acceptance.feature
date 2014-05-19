Feature: Event Bid Form

  Scenario: Voting
    Given I am Bid Committee
    When I vote on an event
    Then My vote is verified
    And Email is sent to Bid Chair

  Scenario: Commenting Publicly - Submitter
    Given I am Event Submitter
    When I comment on my event
    Then Email is sent to Bid Committee

  Scenario: Commenting Publicly
    Given I am Bid Committee
    When I comment on an event
    And The comment is public
    Then The event submitter can see the comment
    And Email is sent to Submitter

  Scenario: Commenting Privately
    Given I am Bid Committee
    When I comment on an event
    And The comment is private
    Then Bid Committee can see the comment

  Scenario: Bid Chair Approval
    Given I am Bid Chair
    When I approve an event
    Then Email is sent to Bid Committee
    And Email is sent to Con Chair
    And Email is sent to Submitter

  Scenario: Bid Chair Decline
    Given I am Bid Chair
    When I decline an event
    Then Email is sent to Bid Committee
    And Email is sent to Con Chair

  Scenario: Con Chair Approval
    Given I am Con Chair
    When I approve an event
    Then Event becomes publicly visible
    And Email is sent to Submitter

  Scenario: Con Chair Decline
    Given I am Con Chair
    When I decline an event
    Then Email is sent to Bid Committee
    And Email is sent to Submitter