Feature: Registration Admin Functions

  Scenario: Change Registration Price
    Given I am Registration
    When I change Registration Price Points
    Then Email is sent to Con Chair

  Scenario: Change User Registration Type
    Given I am Registration
    When I view a user
    Then