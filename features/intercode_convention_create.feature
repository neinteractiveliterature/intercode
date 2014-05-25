Feature: Create Convention

  Scenario: Create a New Convention
    Given I am on the Intercode homepage
    And I am a Global Admin
    When I click on "Add a new convention"
    And I fill "Test Convention" as Convention Title
    And I fill "domain.test" as Convention Domain
    And I click "Create New Convention"
    Then I should be redirected to the Conventions Index
    And I should see the convention I created
    #And "global_admins@intercode2.org" should receive an email