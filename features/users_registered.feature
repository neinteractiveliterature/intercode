Feature: Registered Users Admin Functions

  Background:
    Given There is a sample convention
    And I am in the sample convention domain
    And I am registered convention User

  Scenario: Change First Name
    Given I am on the Update User Information page
    When I enter "Sample" as First Name

  Scenario: Change Last Name
    Given I am on the Update User Information page
    When I enter "Sample" as Last Name

  Scenario: Change Email
    Given I am on the Update User Information page
    When I enter "Sample" as Email

  Scenario: Change Nickname
    Given I am on the Update User Information page
    When I enter "Sample" as Nickname

  Scenario: Change Phone Number
    Given I am on the Update User Information page
    When I enter "Sample" as Phone Number

  Scenario Outline: Change Default Gender
    Given I am on the Update User Information page
    When I select <Options> as Default Gender

  Examples:
    | Options|
    | either |
    | female |
    |  male  |