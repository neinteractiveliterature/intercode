Feature: Registration Admin Functions

  Background:
    Given I am in the sample convention domain
    And I am Registration

  Scenario: Manually Change User Status
    Given There is a unpaid user
    Given I am on the Update User Information page

  Scenario: Change Registration Price
    Given I am on the Update User Information page
    When I change Registration Price Points
    Then Email is sent to Con Chair

  Scenario: ‘Last Signups’ Report
    When I select ‘Last Signups’ Report
    Then I should see a report of the last 10 users signed up

  Scenario: Change User Payment Status
    When I view a user
    Then I should be able to change their Payment Status
    And An email is sent to Registration
    And An email is sent to the User