Feature: Convention Email Privileges

  Scenario: Email GMs
    Given I am GM Liason
    When I send message to all GMs
    Then Email is sent to all GMs

  Scenario: Email Sign-ups
    Given I am Event GM
    When I send message to all event users
    Then Email is sent to all event users

  Scenario: Outreach All Users
    Given I am Outreach
    When I send email to registered users
    And I specify 'All Users'
    Then Email is sent to all registered users

  Scenario: Outreach Registered Users
    Given I am Outreach
    When I send email to registered users
    And No preference is specified
    Then Email is sent to all registered users with Newsletter