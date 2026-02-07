Feature: ShowMeTheMoney Navigation
  As a user viewing the ShowMeTheMoney page
  I want to navigate between different sections easily
  So that I can find the information I need quickly

  Background:
    Given the ShowMeTheMoney page is loaded
    And the navigation tabs are visible

  @smoke @critical @navigation
  Scenario: All navigation tabs are visible
    Given I am on the ShowMeTheMoney page
    Then I should see 10 navigation tabs
    And the tabs should be:
      | Tab Name |
      | Executive |
      | Team |
      | Pricing |
      | Financials |
      | GTM |
      | Expansion |
      | Accelerator |
      | Fundraising |
      | Wireframes |
      | Risks |

  @smoke @critical @navigation
  Scenario: Team tab is positioned correctly
    Given I am viewing the navigation tabs
    Then the "Team" tab should be the 2nd tab
    And it should be between "Executive" and "Pricing"

  @positive @interaction @navigation
  Scenario Outline: Click tab to navigate to section
    Given I am on the ShowMeTheMoney page
    When I click on the "<tab_name>" tab
    Then the "<tab_name>" section should be displayed
    And the "<tab_name>" tab should be active
    And the URL should update to include "<section_id>"

    Examples:
      | tab_name | section_id |
      | Executive | executive |
      | Team | team |
      | Pricing | pricing |
      | Financials | financials |
      | GTM | gtm |
      | Expansion | expansion |
      | Accelerator | accelerator |
      | Fundraising | fundraising |
      | Wireframes | wireframes |
      | Risks | risks |

  @positive @interaction @navigation
  Scenario: Active tab styling
    Given I am on the ShowMeTheMoney page
    When I click on the "Team" tab
    Then the "Team" tab should have gradient background
    And it should have cyan to violet gradient
    And it should have white text
    And it should have shadow effect

  @positive @interaction @navigation
  Scenario: Inactive tab styling
    Given I am on the ShowMeTheMoney page
    And the "Executive" tab is active
    Then the "Team" tab should have transparent background
    And it should have white/40 text
    And on hover it should have white/10 background

  @positive @responsive @navigation
  Scenario: Navigation on mobile devices
    Given I am viewing on a mobile device
    When I look at the navigation
    Then tabs should show abbreviated labels
    And "Executive" should show as "Exec"
    And "Pricing" should show as "Price"
    And "Financials" should show as "Finance"
    And tabs should be horizontally scrollable

  @positive @sticky @navigation
  Scenario: Navigation is sticky
    Given I am on the ShowMeTheMoney page
    When I scroll down the page
    Then the navigation tabs should remain visible
    And they should stick to the top
    And they should have backdrop blur effect

  @positive @accessibility @navigation
  Scenario: Keyboard navigation
    Given I am on the ShowMeTheMoney page
    When I press Tab key
    Then focus should move to the first tab
    When I press Tab again
    Then focus should move to the next tab
    When I press Enter
    Then the focused tab should be activated

  @positive @accessibility @navigation
  Scenario: Screen reader navigation
    Given I am using a screen reader
    When I navigate to the tabs
    Then it should announce "Navigation tabs"
    And each tab should announce its label
    And the active tab should announce "selected"

  @positive @deep-link @navigation
  Scenario: Direct URL navigation
    Given I navigate to "/showmethemoney#team"
    Then the Team section should be displayed
    And the Team tab should be active
    And the page should scroll to Team section

  @positive @history @navigation
  Scenario: Browser back button works
    Given I am on the "Team" section
    When I click on the "Pricing" section
    And I click the browser back button
    Then I should return to the "Team" section
    And the Team tab should be active

  @performance @navigation
  Scenario: Tab switching performance
    Given I am on the ShowMeTheMoney page
    When I click on any tab
    Then the section should change within 300ms
    And there should be no visible lag
    And animations should be smooth

  @negative @error-handling @navigation
  Scenario: Invalid section ID
    Given I navigate to "/showmethemoney#invalid"
    Then I should see the Executive section by default
    And the Executive tab should be active
    And no error should be shown

  @integration @navigation @jarvis
  Scenario: JARVIS can navigate via voice
    Given I am on any section
    When I ask JARVIS "Go to Team section"
    Then the Team section should be displayed
    And the Team tab should become active

  @integration @navigation @scroll
  Scenario: Scroll to section updates tab
    Given I am on the Executive section
    When I scroll down to the Team section
    Then the Team tab should become active
    And the URL should update

  @visual-regression @navigation
  Scenario: Navigation visual consistency
    Given I am on the ShowMeTheMoney page
    Then all tabs should have consistent padding
    And all tabs should have consistent border radius
    And the active indicator should be clearly visible
    And spacing between tabs should be uniform
