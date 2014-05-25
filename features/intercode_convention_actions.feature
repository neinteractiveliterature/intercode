Feature: Edit Global Conventions

  Background:
    Given I am a Global Admin
    And There is a sample convention
    And I am on the Edit Convention page

  Scenario: Edit Convention Name
    When I fill "New Convention Title" as Convention Title
    And I click on "Update Convention"
    Then I should be redirected to the Conventions Index
    And I should see the renamed convention
    #And "global_admins@intercode2.org" should receive an email

  Scenario: Edit Convention Domain
    When I fill "new.domain" as Convention Domain
    And I click on "Update Convention"
    Then I should be redirected to the Conventions Index
    And I should see the new conventions domain
    #And "global_admins@intercode2.org" should receive an email

  #Do we want a 'disable' control?
  Scenario: Disable Convention
    Given I am a Global Admin
    When I disable a convention
    Then The convention redirects to the homepage
    And Email is sent to all Global Admins