Feature: Registered Users Admin Functions

  Background:
    Given There is a sample convention
    And I am in the sample convention domain
    And I am registered convention User
    And I am on the Update User Information page

  Scenario: Change First Name
    When I enter "FName" as First Name
    And I enter my password
    And I click "Update"

  Scenario: Change Last Name
    When I enter "LName" as Last Name
    And I enter my password
    And I click "Update"

  Scenario: Change Email
    When I enter "Sample" as Email
    And I enter my password
    And I click "Update"

  Scenario: Change Nickname
    When I enter "Sample" as Nickname
    And I enter my password
    And I click "Update"

  Scenario: Change Phone Number
    When I enter "Sample" as Phone Number
    And I enter my password
    And I click "Update"

  Scenario Outline: Change Default Gender
    When I select <Options> as Default Gender
    And I enter my password
    And I click "Update"

  Examples:
    | Options|
    | either |
    | female |
    |  male  |

  Scenario: Do Not Show User Con Bio
    Given I am not Event GM
    And I am not Event Submitter
    And I am not Staff
    When I am on the Update User Information page
    Then I should not see "Con Bio"