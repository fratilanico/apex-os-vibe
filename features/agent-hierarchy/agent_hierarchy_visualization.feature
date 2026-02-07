Feature: Agent Hierarchy Visualization
  As an investor viewing the ShowMeTheMoney page
  I want to see the multi-agent orchestration system
  So that I can understand the technical sophistication and scalability

  Background:
    Given the ShowMeTheMoney page is loaded
    And I navigate to the Team section
    And the Agent Hierarchy Visualization is displayed

  @smoke @critical @agent-hierarchy
  Scenario: Team tab displays agent hierarchy
    Given I am on the ShowMeTheMoney page
    When I click on the "Team" tab
    Then the Team section should be displayed
    And I should see the title "Multi-Agent Orchestration"
    And I should see the subtitle "Hierarchical AI Agent Swarm with Real-Time Coordination"
    And I should see "12 Agents Active" indicator
    And I should see "Fork 4" badge

  @smoke @critical @agent-hierarchy
  Scenario: Founder level agent is displayed
    Given I am on the Team section
    Then I should see the APEX OS MONSTER agent card
    And it should be labeled "Founder & Chief Orchestrator"
    And it should have a crown icon
    And it should span the full width
    And it should have violet/fuchsia gradient styling

  @positive @ui @agent-hierarchy
  Scenario Outline: Executive level agents are displayed
    Given I am on the Team section
    Then I should see the "<agent_name>" agent card
    And it should be labeled "<role>"
    And it should have "<icon>" icon
    And it should have blue/cyan gradient styling
    And it should show status "<status>"

    Examples:
      | agent_name | role | icon | status |
      | J.A.R.V.I.S. | Executive AI Director | Brain | active |
      | CLI Builder | Executive Operations | Terminal | busy |
      | DevOps Swarm | Executive Infrastructure | Cloud | active |
      | Content Strategist | Executive Content | FileCode | active |

  @positive @ui @agent-hierarchy
  Scenario Outline: Specialist AI models under JARVIS
    Given I am on the Team section
    When I expand the J.A.R.V.I.S. executive agent
    Then I should see "<model_name>" specialist model
    And it should be labeled "<specialty>"
    And it should have pink/rose gradient styling

    Examples:
      | model_name | specialty |
      | QWEN | Code Specialist |
      | DEEPSEEK | Analysis Specialist |
      | LLAMA | Creative Specialist |
      | PHI-3 | Logic Specialist |

  @positive @interaction @agent-hierarchy
  Scenario: Click agent to view details
    Given I am on the Team section
    When I click on the "J.A.R.V.I.S." agent card
    Then a detail panel should slide in from the right
    And I should see J.A.R.V.I.S. full details
    And I should see performance metrics
    And I should see capabilities list
    And I should see current activity
    And I should see subordinate agents

  @positive @interaction @agent-hierarchy
  Scenario: Agent detail panel shows metrics
    Given I have opened an agent detail panel
    Then I should see "Tasks Completed" metric
    And I should see "Success Rate" percentage
    And I should see "Avg Response Time"
    And the metrics should be displayed with progress bars

  @positive @interaction @agent-hierarchy
  Scenario: Close agent detail panel
    Given the agent detail panel is open
    When I click the close button
    Then the panel should slide out to the right
    And the main hierarchy view should be visible

  @positive @visual @agent-hierarchy
  Scenario: Agent cards have status indicators
    Given I am on the Team section
    Then each agent card should show a status badge
    And active agents should show green "Active" badge
    And busy agents should show amber "Busy" badge
    And syncing agents should show blue "Syncing" badge with pulse

  @positive @visual @agent-hierarchy
  Scenario: Agent hierarchy has connection lines
    Given I am on the Team section
    Then I should see connection lines between agent levels
    And lines should connect Founder to Executives
    And lines should connect Executives to their children
    And lines should animate on page load

  @positive @animation @agent-hierarchy
  Scenario: Agent cards animate on scroll
    Given I am on the Team section
    When I scroll down to view more agents
    Then agent cards should fade in with stagger effect
    And each card should slide up 20px
    And animation should take 0.5 seconds per card
    And delay should increase by 0.1s per card

  @positive @view-toggle @agent-hierarchy
  Scenario: Switch between view modes
    Given I am on the Team section
    Then I should see view toggle buttons
    When I click "Hierarchy" view
    Then the tree structure should be displayed
    When I click "Metrics" view
    Then system statistics should be displayed
    When I click "Flow" view
    Then data flow visualization should be displayed

  @positive @metrics @agent-hierarchy
  Scenario: System metrics view
    Given I am on the Team section
    When I switch to "Metrics" view
    Then I should see "System Health" card
    And I should see "Task Distribution" card
    And I should see "Coordination" card
    And each card should show relevant statistics

  @positive @responsive @agent-hierarchy
  Scenario: Agent hierarchy on mobile
    Given I am viewing on a mobile device
    When I navigate to the Team section
    Then agents should display in single column
    And cards should be touch-friendly
    And detail panel should take full screen
    And swipe gestures should work

  @positive @accessibility @agent-hierarchy
  Scenario: Agent hierarchy accessibility
    Given I am using a screen reader
    When I navigate to the Team section
    Then the hierarchy should be announced as a tree
    And each agent should be focusable
    And agent roles should be announced
    And status changes should be announced

  @performance @agent-hierarchy
  Scenario: Agent hierarchy performance
    Given I am on the Team section
    When the page loads
    Then the hierarchy should render within 500ms
    And animations should run at 60fps
    And scrolling should be smooth
    And memory usage should be under 50MB

  @negative @error-handling @agent-hierarchy
  Scenario: Handle missing agent data
    Given an agent has no metrics data
    When the hierarchy is displayed
    Then the agent should still appear
    And missing metrics should show "N/A"
    And the UI should not break

  @integration @agent-hierarchy @jarvis
  Scenario: JARVIS explains agent hierarchy
    Given I am on the Team section
    When I ask JARVIS "What is the DevOps Swarm?"
    Then JARVIS should highlight the DevOps Swarm card
    And JARVIS should explain its role
    And JARVIS should list its subordinate agents

  @integration @agent-hierarchy @real-time
  Scenario: Real-time agent status updates
    Given I am on the Team section
    When an agent status changes
    Then the status badge should update
    And the change should animate
    And a toast notification should appear
    And the update should happen within 1 second

  @load-testing @agent-hierarchy
  Scenario: Hierarchy handles many agents
    Given the system has 50+ agents
    When I view the Team section
    Then the hierarchy should render without lag
    And scrolling should remain smooth
    And expand/collapse should work quickly

  @visual-regression @agent-hierarchy
  Scenario: Agent hierarchy visual consistency
    Given I am on the Team section
    Then all agent cards should have consistent styling
    And gradients should match design system
    And spacing should be uniform
    And typography should be consistent
