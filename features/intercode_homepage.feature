Feature: Non-convention Home page

  Scenario: Create a New Convention
    Given I am on the Intercode homepage
    And I am a Global Admin
    When I click on "Add a new convention"
    And I fill "Test Convention" as Name
    And I fill "domain.test" as Domain
    And I click "Save Conventions"
    Then I should see the convention I created
    And "global_admins@intercode2.org" should receive an email

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
     When I am on the Intercode homepage
     Then I see a list of conventions