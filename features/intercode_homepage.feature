##How do we want the Non-convention Homepage to respond to basic users? Global Users? etc.

Feature: Conventions List

  Background:
    Given There is a sample convention

  Scenario: See Past Convention
    Given This convention occurred in the past
    When I am on the Intercode homepage
    Then I should see "Past Conventions"
    And The sample convention is displayed

  Scenario: See Current Convention
    Given This convention occurs today
    When I am on the Intercode homepage
    Then I should see "Current Conventions"
    And The sample convention is displayed

  Scenario: See Future Convention
    Given This convention occurs in the future
    When I am on the Intercode homepage
    Then I should see "Upcoming Conventions"
    And The sample convention is displayed

  Scenario: See No Date Convention
    Given This convention has no dates
    When I am on the Intercode homepage
    Then I should see "Unspecified"
    And The sample convention is displayed
    And I should not see the dates

  Scenario: Non-registered User
    Given I am not convention User
    When I am on the Intercode homepage
    Then I should not see Edit Convention link
    And I should not see Add Convention link

  Scenario: Registered User
    Given I am a Global User
    When I am on the Intercode homepage
    Then I should not see Edit Convention link
    And I should not see Add Convention link

  Scenario: Staff User
    Given I am Staff
    When I am on the Intercode homepage
    Then I should see Edit Convention link
    And I should not see Add Convention link

  Scenario: Global Admins see Edit / Add
    Given I am a Global Admin
    When I am on the Intercode homepage
    Then I should see Edit Convention link
    And I should see Add Convention link