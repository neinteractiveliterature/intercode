Feature: Payment / Shopping Cart

  Scenario: Convention Cart
    Given I am convention User
    When I select 'Pay for Convention'
    Then I am redirected to T-Shirt Page
    And Convention Pass is in Cart

  Scenario: T-Shirt Upsell
    Given I am convention User
    And I am Unpaid
    When I checkout
    Then I am notified about T-Shirts

  Scenario: Vendor Payment
    Given I am convention User
    And I select 'Vendor Pass'
    Then I am redirected to Checkout
    And Vendor Pass is in Cart

  Scenario: T-Shirt Cart
    Given I am convention User
    And I am Paid
    When I select 'Buy T-Shirt'
    Then I am redirected to Checkout

  Scenario: Checkout
    Given I am convention User
    When I checkout
    Then I am asked Payment Method

  Scenario: PayPal Checkout
    Given PayPal is selected as payment method
    When User pays for convention
    Then I am redirected to Paypal
    And IPN Gateway(?)

  Scenario: Stripe Checkout
    Given I do not select PayPal as Payment Method
    When User pays
    Then Stripe takes over

  Scenario: Checkout Complete
    Given I am convention User
    When Payment is accepted
    Then Email is sent to User
    And Paid registration status is set