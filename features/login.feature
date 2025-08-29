Feature: User login to create post on Chuannhadat.com
  As a user of chuannhadat.com
  I want to log in successfully
  So that I can create and publish posts

  Background:
    Given I am on the chuannhadat.com homepage

  @smoke @login @happy-path
  Scenario: Successful login to access post creation
    When I click on the login button
    And I wait for the login modal to open
    And I enter username "{configured}"
    And I enter password "{configured}"
    And I click the submit button in the login modal
    Then I should be successfully logged in
