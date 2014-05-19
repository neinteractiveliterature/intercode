Feature: Event Page

  Scenario: Generic Event View
    Given I am not convention User
    When I view an event
    Then Limited Event Information is displayed

  Scenario: Logged In Event View - No Signups
    Given I am convention User
    And Event Sign-up not active
    When I view an event
    Then Event Information is displayed

  Scenario: Logged In Event View - With Signups
    Given I am convention User
    And I am Paid
    And Event Sign-up active
    When I view an event
    Then Event Information is displayed
    And I can sign-up for Event

  Scenario: Edit Event Listing
    Given I am Event GM
    When I view my event
    Then 'Edit Event Information' is linked

  Scenario: View Bid - Bid Committee
    Given I am Bid Committee
    When I view an event
    Then 'Bid Information' is linked

  Scenario: View Bid - Event GM
    Given I am Event Submitter
    When I view my event
    Then 'Bid Information' is linked