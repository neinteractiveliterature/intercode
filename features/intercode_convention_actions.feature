Feature: Create Conventions

  Scenario: Create a New Convention
    Given I am on the Intercode homepage
    And I am a Global Admin
    When I click on "Add a new convention"
    And I fill "Test Convention" as Convention Name
    And I fill "domain.test" as Convention Domain
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