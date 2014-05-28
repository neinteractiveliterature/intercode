Feature: GM Admin Functions

  Given There is a sample convention
  And I am in the sample convention domain
  And I am GM

  Scenario: Edit Bio
    Given I am Event GM
    When I am on the Update User Information page
    Then I should see "Con Bio"