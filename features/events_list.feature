Feature: List of Events

  Scenario: Sort By Title
    Given I can see Events
    When I select 'Sort by Title'
    Then Events are sorted alphabetically by Name

  Scenario: Sort By Date Accepted
    Given I can see Events
    When I select 'Sort by Date'
    Then Events are sorted descending by Date Accepted

  Scenario: Sort by Event Time
    Given I can see Events
    When I select 'Sort by Time'
    Then Events are sorted by run slot

  Scenario: Event Listing
    Given I can see Events
    When I click on Event Listing
    Then I am redirected to Event Page