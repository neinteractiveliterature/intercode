Feature: Schedule Display

   Scenario: Generic Schedule View
    Given I am not convention User
    When I view the schedule
    Then Limited Event Information is displayed

  Scenario: Logged In Event View - Public
    Given I am convention User
    And Event Schedule is Public
    When I view the schedule
    Then Events Schedule is displayed

  Scenario: Logged In Event View - Not Public
    Given I am Scheduling
    And Event Schedule is Private
    When I view the schedule
    Then Events Schedule is displayed