#!/bin/bash

# Mission Control - Agent Communication System
# All agents write to .agent_sync_state.json every 3 minutes
# This script manages the heartbeat and communication

WORKSPACE="/Users/nico/apex-os-vibe"
SYNC_FILE="$WORKSPACE/.agent_sync_state.json"
LOG_FILE="$WORKSPACE/.agent_communication.log"
HEARTBEAT_INTERVAL=180  # 3 minutes in seconds

echo "🚀 Mission Control Starting..."
echo "📁 Workspace: $WORKSPACE"
echo "📄 Sync File: $SYNC_FILE"
echo "⏰ Heartbeat: Every 3 minutes"
echo ""

# Function to update heartbeat
timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

# Initialize sync file
initialize_sync() {
    cat > "$SYNC_FILE" << EOF
{
  "system": "Mission Control v1.0",
  "timestamp": "$(timestamp)",
  "mode": "LIVE",
  "heartbeat_interval": "3_MINUTES",
  "agents": {
    "@apex-os-cli-builder": {
      "role": "Orchestrator",
      "status": "ACTIVE",
      "last_seen": "$(timestamp)",
      "current_task": "Managing agent swarm"
    }
  },
  "communication_log": [],
  "tasks": [],
  "instructions": "ALL AGENTS: Check this file every 3 minutes. Write your updates here."
}
EOF
    echo "✅ Sync file initialized"
}

# Function to add log entry
log_message() {
    local agent="$1"
    local message="$2"
    local timestamp=$(timestamp)
    
    echo "[$timestamp] $agent: $message" >> "$LOG_FILE"
    
    # Update JSON file
    python3 << PYTHON
import json
from datetime import datetime

try:
    with open('$SYNC_FILE', 'r') as f:
        data = json.load(f)
    
    # Add to communication log
    if 'communication_log' not in data:
        data['communication_log'] = []
    
    data['communication_log'].append({
        'timestamp': '$timestamp',
        'agent': '$agent',
        'message': '$message'
    })
    
    # Update agent status
    if 'agents' not in data:
        data['agents'] = {}
    
    if '$agent' not in data['agents']:
        data['agents']['$agent'] = {}
    
    data['agents']['$agent']['last_seen'] = '$timestamp'
    data['agents']['$agent']['status'] = 'ACTIVE'
    
    data['timestamp'] = '$timestamp'
    
    with open('$SYNC_FILE', 'w') as f:
        json.dump(data, f, indent=2)
except Exception as e:
    print(f"Error: {e}")
PYTHON
}

# Main heartbeat loop
heartbeat_loop() {
    while true; do
        echo "💓 Heartbeat: $(timestamp)"
        log_message "@apex-os-cli-builder" "Orchestrator heartbeat - System active"
        
        # Check for new messages from other agents
        check_agent_updates
        
        sleep $HEARTBEAT_INTERVAL
    done
}

# Check for updates from other agents
check_agent_updates() {
    python3 << PYTHON
import json
from datetime import datetime

try:
    with open('$SYNC_FILE', 'r') as f:
        data = json.load(f)
    
    # Check for new messages in last 3 minutes
    if 'communication_log' in data and len(data['communication_log']) > 0:
        latest = data['communication_log'][-1]
        print(f"📨 Latest message from {latest['agent']}: {latest['message']}")
    
    # Check agent statuses
    if 'agents' in data:
        for agent, info in data['agents'].items():
            if agent != '@apex-os-cli-builder':
                print(f"👤 {agent}: {info.get('status', 'UNKNOWN')} - Last seen: {info.get('last_seen', 'NEVER')}")
except Exception as e:
    print(f"Error checking updates: {e}")
PYTHON
}

# Command handler
case "$1" in
    init)
        initialize_sync
        ;;
    heartbeat)
        heartbeat_loop
        ;;
    log)
        log_message "$2" "$3"
        ;;
    status)
        cat "$SYNC_FILE"
        ;;
    *)
        echo "Usage: $0 {init|heartbeat|log <agent> <message>|status}"
        echo ""
        echo "Commands:"
        echo "  init      - Initialize the sync system"
        echo "  heartbeat - Start heartbeat loop (runs forever)"
        echo "  log       - Log a message from an agent"
        echo "  status    - Show current sync file"
        ;;
esac
