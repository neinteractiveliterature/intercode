Feature: Submitting / Updating Events

  Scenario: Submit Event
    Given I am convention User
    When I submit an event
    Then I become the Event Submitter
    And Email is sent to Bid Committee
    And Email is sent to Event Submitter

  Scenario: Submitter Updates Before Bid Committee
    Given I am Event Submitter
    And The event is private
    When I update an event
    Then Email is sent to Bid Committee

  Scenario: Submitter Removal Before Bid Committee
    Given I am Event Submitter
    And The event is private
    When I delete an event
    Then Email is sent to Bid Committee

  Scenario: Submitter Update Before Sign-ups
    Given I am Event Submitter
    And The event is public
    And There are no sign-ups
    When I update an event
    Then Email is sent to Staff

  Scenario: Submitter Updates After Sign-ups
    Given I am Event Submitter
    And The event is public
    And There are users signed-up
    When I update an event
    Then Email is sent to Staff
    And Email is sent to affected users

  Scenario: Submitter Removal After Bid Committee
    Given I am Event Submitter
    And The event is public
    When I try to delete an event
    Then The event is made private
    And Email is sent to Staff