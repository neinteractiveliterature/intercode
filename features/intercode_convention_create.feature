Feature: Create Convention

  Scenario: Create a New Convention without Dates
    Given I am on the Intercode homepage
    And I am a Global Admin
    When I click on "Add a new convention"
    And I fill "Test Convention" as Convention Title
    And I fill "domain.test" as Convention Domain
    And I click "Create New Convention"
    Then I should be redirected to the Conventions Index
    And I should see the convention I created
    And I should see "Unspecified Dates"
    #And "global_admins@intercode2.org" should receive an email

  Scenario: Create a New Convention with Past Dates
    Given I am on the Intercode homepage
    And I am a Global Admin
    When I click on "Add a new convention"
    And I fill "Test Convention" as Convention Title
    And I fill "domain.test" as Convention Domain
    And I fill "1/1/2001" as Convention Start Date
    And I fill "1/1/2002" as Convention End Date
    And I click "Create New Convention"
    Then I should be redirected to the Conventions Index
    And I should see the convention I created
    And I should see "Past Conventions"
    #And "global_admins@intercode2.org" should receive an email

  Scenario: Create a New Convention with Current Dates
    Given I am on the Intercode homepage
    And I am a Global Admin
    When I click on "Add a new convention"
    And I fill "Test Convention" as Convention Title
    And I fill "domain.test" as Convention Domain
    And I fill current dates for Start and End Date
    And I click "Create New Convention"
    Then I should be redirected to the Conventions Index
    And I should see the convention I created
    And I should see "Current Conventions"
    #And "global_admins@intercode2.org" should receive an email


  Scenario: Create a New Convention with Future Dates
    Given I am on the Intercode homepage
    And I am a Global Admin
    When I click on "Add a new convention"
    And I fill "Test Convention" as Convention Title
    And I fill "domain.test" as Convention Domain
    And I fill "1/1/3001" as Convention Start Date
    And I fill "1/1/3002" as Convention End Date
    And I click "Create New Convention"
    Then I should be redirected to the Conventions Index
    And I should see the convention I created
    And I should see "Upcoming Conventions"
    #And "global_admins@intercode2.org" should receive an email