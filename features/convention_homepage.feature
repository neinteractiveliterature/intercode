Feature: Convention Homepage

  Background:
    Given I am in the sample convention domain

  Scenario: Front Page of Convention
    When I am on the convention homepage
    Then I should see the convention name

  Scenario: Login