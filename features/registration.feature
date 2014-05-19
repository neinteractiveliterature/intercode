Feature: Registration for Convention

  Scenario: New Sign-up for Convention
    Given I am not Alumni
    When I sign-up for convention
    Then I am redirected to Payment

  Scenario: Alumni Sign-up
    Given I am Alumni
    When I sign-up for convention
    Then I am prompted to confirm my information
    And I am redirected to Payment

  Scenario: Non-payment
    Given I am convention User
    And I am Unpaid
    When I login
    Then I am redirected to Payment