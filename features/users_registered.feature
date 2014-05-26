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
    When I enter "Sample" as First Name

  Scenario: Change Email
    Given I am on the Update User Information page
    When I enter "Sample" as First Name

  Scenario: Change Nickname
    Given I am on the Update User Information page
    When I enter "Sample" as First Name