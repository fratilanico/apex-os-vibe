Feature: JARVIS Voice Assistant Integration
  As a user viewing the ShowMeTheMoney page
  I want to interact with JARVIS voice assistant
  So that I can get financial information through voice commands

  Background:
    Given the ShowMeTheMoney page is loaded
    And JARVIS is initialized
    And the JARVIS floating button is visible

  @smoke @critical @jarvis
  Scenario: JARVIS floating button is accessible
    Given I am on any section of ShowMeTheMoney
    When I look at the bottom-right corner
    Then I should see the JARVIS floating button
    And the button should have a microphone icon
    And the button should pulse subtly when idle

  @positive @ui @jarvis
  Scenario: Open JARVIS chat panel by clicking button
    Given the JARVIS floating button is visible
    When I click on the JARVIS button
    Then the chat panel should slide up from the bottom
    And I should see a welcome message from JARVIS
    And I should see quick action chips for common queries
    And the voice waveform should be visible

  @positive @voice @jarvis
  Scenario: Activate JARVIS with voice wake word
    Given the JARVIS chat panel is closed
    When I say "Hey JARVIS"
    Then the chat panel should open automatically
    And JARVIS should show listening state
    And the voice waveform should animate

  @positive @query @jarvis @financial
  Scenario: Query MRR projection
    Given the JARVIS chat panel is open
    When I type "What's our MRR in month 6?"
    Then JARVIS should respond within 2 seconds
    And the response should contain "$847,000"
    And the response should explain the calculation
    And the response should mention 34,000 leads

  @positive @query @jarvis @financial
  Scenario Outline: Query various financial metrics
    Given the JARVIS chat panel is open
    When I type "<query>"
    Then JARVIS should respond with accurate data
    And the response should contain "<expected_value>"
    And the response should be contextually relevant

    Examples:
      | query | expected_value |
      | What's our CAC? | $150 |
      | What's the LTV? | $1,466 |
      | What's the LTV:CAC ratio? | 9.8:1 |
      | What's Year 1 revenue? | $501,000 |
      | What's the blended ARPU? | $165 |

  @positive @navigation @jarvis
  Scenario Outline: Navigate to sections via voice
    Given the JARVIS chat panel is open
    When I type "<command>"
    Then the page should scroll to the "<section>" section
    And the "<section>" tab should become active
    And JARVIS should confirm the navigation

    Examples:
      | command | section |
      | Take me to pricing | pricing |
      | Show me the accelerator | accelerator |
      | Go to financial projections | financials |
      | Show me the team | team |
      | Navigate to fundraising | fundraising |

  @positive @explanation @jarvis
  Scenario Outline: Get explanations of business concepts
    Given the JARVIS chat panel is open
    When I type "<question>"
    Then JARVIS should provide a clear explanation
    And the explanation should be under 100 words
    And the explanation should include key points

    Examples:
      | question |
      | What is shadow branding? |
      | Explain the 15% equity model |
      | How does PPP pricing work? |
      | What is the accelerator program? |
      | Explain the sovereign B2B database |

  @positive @agent-status @jarvis
  Scenario: Query agent swarm status
    Given the JARVIS chat panel is open
    When I type "Show me the agent swarm status"
    Then JARVIS should navigate to the Team tab
    And JARVIS should highlight the agent hierarchy
    And JARVIS should report active agent count
    And JARVIS should show current agent activities

  @positive @contextual-help @jarvis
  Scenario: Contextual help on hover
    Given I am viewing the Financial Projections section
    When I hover over the "LTV:CAC 9.8:1" metric
    Then a JARVIS help icon should appear
    When I click the help icon
    Then JARVIS should explain the metric
    And the explanation should say "We earn $9.80 for every $1 spent acquiring customers"

  @negative @error-handling @jarvis
  Scenario: Handle unrecognized voice command
    Given the JARVIS chat panel is open
    When I type "xyz abc 123 nonsense"
    Then JARVIS should respond politely
    And JARVIS should suggest available commands
    And JARVIS should show quick action chips

  @negative @error-handling @jarvis
  Scenario: Handle voice recognition failure
    Given the JARVIS chat panel is open
    And I activate voice input
    When the microphone fails to capture audio
    Then JARVIS should show an error message
    And JARVIS should suggest typing instead
    And the text input field should be focused

  @performance @jarvis
  Scenario: JARVIS response time performance
    Given the JARVIS chat panel is open
    When I send any query
    Then JARVIS should respond within 2 seconds
    And the voice synthesis should complete within 3 seconds
    And the UI should remain responsive

  @accessibility @jarvis
  Scenario: JARVIS accessibility features
    Given I am using a screen reader
    When I navigate to the JARVIS button
    Then the button should have aria-label "Open JARVIS voice assistant"
    When I open the chat panel
    Then all messages should be announced
    And the quick action chips should be keyboard accessible

  @mobile @responsive @jarvis
  Scenario: JARVIS on mobile devices
    Given I am viewing on a mobile device
    When I look at the bottom-right corner
    Then the JARVIS button should be 48px diameter
    And the button should not overlap content
    When I click the button
    Then the chat panel should take full width
    And the chat panel should be swipeable to close

  @integration @jarvis @team
  Scenario: JARVIS integration with Team tab
    Given I am on any section
    When I ask JARVIS "What is the CLI Builder working on?"
    Then JARVIS should navigate to Team tab
    And JARVIS should highlight the CLI Builder agent
    And JARVIS should display the agent's current activity
    And the detail panel should open for CLI Builder

  @integration @jarvis @financials
  Scenario: JARVIS integration with financial data
    Given I am on the Executive Summary section
    When I ask JARVIS "Show me the revenue breakdown"
    Then JARVIS should highlight the revenue chart
    And JARVIS should explain each revenue stream
    And JARVIS should show the accelerator vs course split

  @security @privacy @jarvis
  Scenario: JARVIS data privacy
    Given I am using JARVIS
    When I ask about sensitive financial data
    Then JARVIS should only show data visible on the page
    And JARVIS should not expose internal calculations
    And JARVIS should not reveal unreleased information

  @load-testing @jarvis
  Scenario: JARVIS handles multiple rapid queries
    Given the JARVIS chat panel is open
    When I send 10 queries in rapid succession
    Then JARVIS should queue the queries
    And JARVIS should respond to each in order
    And the UI should not crash or freeze
    And memory usage should remain stable

  @offline @jarvis
  Scenario: JARVIS offline behavior
    Given the JARVIS chat panel is open
    When the network connection is lost
    Then JARVIS should show offline indicator
    And JARVIS should queue my query
    When the connection is restored
    Then JARVIS should process the queued query
    And JARVIS should notify me of reconnection
