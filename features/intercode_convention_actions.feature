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

  Scenario: Edit Convention Dates - Past
    When I fill "1/1/2001" as Convention Start Date
    And I fill "1/1/2002" as Convention End Date
    And I click on "Update Convention"
    Then I should be redirected to the Conventions Index
    And I should see "Past Conventions"
    And I should see the dates displayed
    #And "global_admins@intercode2.org" should receive an email

  Scenario: Edit Convention Dates - Current
    When I fill current dates for Start and End Date
    And I click on "Update Convention"
    Then I should be redirected to the Conventions Index
    And I should see "Current Conventions"
    And I should see the dates displayed
    #And "global_admins@intercode2.org" should receive an email

  Scenario: Edit Convention Dates - Future
    When I fill "1/1/3001" as Convention Start Date
    And I fill "1/1/3002" as Convention End Date
    And I click on "Update Convention"
    Then I should be redirected to the Conventions Index
    And I should see "Upcoming Conventions"
    And I should see the dates displayed
    #And "global_admins@intercode2.org" should receive an email