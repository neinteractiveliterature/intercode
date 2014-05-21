Feature: Registration Admin Functions

  Scenario: Change Registration Price
    Given I am Registration
    When I change Registration Price Points
    Then Email is sent to Con Chair

  Feature: ‘Last Signups’ Report
    Given I am Registration
    When I select ‘Last Signups’ Report
    Then I should see a report of the last 10 users signed up

  Feature: Change User Payment Status
    Given I am Registration
    When I view a user
    Then I should be able to change their Payment Status
    And An email is sent to Registration
    And An email is sent to the User