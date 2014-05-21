Feature: GM Admin Functions

  Scenario: Edit Bio
    Given I am GM
    When I view my User Page
    Then I should be able to edit my bio