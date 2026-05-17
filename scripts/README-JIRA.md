# Creating Jira Issues from FEATURES.md

This guide explains how to create all the epics and stories in Jira using both the Atlassian VS Code extension and the PowerShell script.

## Prerequisites

- Atlassian for VS Code extension installed ✓
- Atlassian MCP Server extension installed ✓
- Jira account with API access
- Project created in Jira

## Option 1: Using VS Code Atlassian Extension (Interactive)

### Step 1: Configure the Extension

1. Open VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type: `Atlassian: Add Jira`
3. Enter your Jira site URL (e.g., `https://your-company.atlassian.net`)
4. Follow prompts to authenticate

### Step 2: Create Issues Manually

1. Open the Atlassian sidebar (click Atlassian icon in Activity Bar)
2. Navigate to your project
3. Use the `jira-import.json` file as a reference to create:
   - 8 Epics (EPIC-1 through EPIC-8)
   - 41 Stories linked to their respective epics

**Tip:** You can right-click in the Atlassian panel to create new issues.

## Option 2: Using PowerShell Script (Automated)

### Step 1: Get Your Jira API Token

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "AdanBrowser Import")
4. Copy the token (save it securely!)

### Step 2: Run the Import Script

```powershell
# Navigate to project root
cd c:\Users\Yassine\workspace\adanbrowser

# Run the script
.\scripts\create-jira-issues.ps1 `
    -JiraUrl "https://your-company.atlassian.net" `
    -JiraEmail "your-email@example.com" `
    -JiraApiToken "your-api-token-here" `
    -ProjectKey "ADAN"
```

Replace:
- `your-company.atlassian.net` with your Jira URL
- `your-email@example.com` with your Atlassian account email
- `your-api-token-here` with the API token from Step 1
- `ADAN` with your actual Jira project key

### Step 3: Verify

The script will:
- Create all 8 epics
- Create all 41 stories linked to their epics
- Set the correct status (Done, To Do, In Progress)
- Add appropriate labels
- Print a summary of created issues

## Option 3: Manual Import via Jira CSV

### Step 1: Convert JSON to CSV

Open PowerShell and run:

```powershell
# This will be created in the next step if you need it
# For now, use Option 1 or 2 above
```

## Data Structure

The `jira-import.json` file contains:

- **8 Epics:**
  1. Dev Environment & Build Pipeline (5 stories, all DONE)
  2. Core Interruption Flow (7 stories, 4 DONE, 3 TODO)
  3. Infrastructure Adapters (3 stories, all TODO)
  4. Prayer Time Scheduling (4 stories, all TODO)
  5. Localisation (3 stories, all TODO)
  6. Overlay UX & Polish (4 stories, all TODO)
  7. Quality & Testing (6 stories, all TODO)
  8. Popup & Options UI (2 stories, all TODO)

- **Total:** 41 stories across 8 epics

## Troubleshooting

### "Authentication failed"
- Verify your API token is correct
- Make sure you're using your email, not username
- Check that your Jira URL is correct (include https://)

### "Project not found"
- Verify the project key exists in your Jira instance
- Make sure you have permission to create issues in that project

### "Cannot create Epic"
- Some Jira instances require the Epic issue type to be enabled
- Check with your Jira administrator

### Status transitions fail
- Jira workflow transition IDs vary by instance
- You may need to adjust the `$statusMap` in the script
- To find your transition IDs:
  1. Go to Jira Project Settings → Workflows
  2. Click on your workflow
  3. Note the transition IDs for your statuses

## After Import

Once issues are created:

1. Review them in Jira: `https://your-company.atlassian.net/browse/PROJECTKEY`
2. Adjust priorities, assignments, and sprint allocation
3. Update `docs/FEATURES.md` to reference Jira ticket IDs if needed

## Keeping in Sync

To keep FEATURES.md and Jira synchronized:

1. **Manual sync:** Update both when making changes
2. **Automation:** Set up Jira webhooks to auto-update FEATURES.md
3. **Best practice:** Make Jira the source of truth, export to FEATURES.md regularly

---

**Need Help?**

- Atlassian Extension Docs: https://marketplace.visualstudio.com/items?itemName=Atlassian.atlascode
- Jira REST API: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
- Project docs: See `docs/FEATURES.md` for the canonical feature list
