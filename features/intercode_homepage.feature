Feature: Non-convention Home page

  Scenario: Create Convention
    Given I am a Global Admin
    When I create a convention
    Then I am redirected to the convention
    And Email is sent to all Global Admins

  Scenario: Disable Convention
    Given I am a Global Admin
    When I disable a convention
    Then The convention redirects to the homepage
    And Email is sent to all Global Admins

  Scenario: Edit Convention
    Given I am a Global Admin
    When I edit a conventions properties
    Then I am redirected to the convention
    And Email is sent to all Global Admins

    ##How do we want the Non-convention Homepage to respond to basic users? Global Users? etc.

   Scenario: See Convention List
     Given I am a Global
     When I am on the homepage
     Then I see a list of conventions