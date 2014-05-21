Feature: Ops Admin Functions

  Scenario: Report as CSV
    Given I am Ops
    When I view a report
    Then I should be able to get that report as a CSV