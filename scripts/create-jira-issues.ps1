# PowerShell Script to Create Jira Issues from FEATURES.md
# This script uses the Jira REST API to create epics and stories

param(
    [Parameter(Mandatory=$true)]
    [string]$JiraUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$JiraEmail,
    
    [Parameter(Mandatory=$true)]
    [string]$JiraApiToken,
    
    [Parameter(Mandatory=$true)]
    [string]$ProjectKey
)

# Read the JSON file
$jsonPath = Join-Path $PSScriptRoot "..\jira-import.json"
$data = Get-Content $jsonPath -Raw | ConvertFrom-Json

# Create basic auth header
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${JiraEmail}:${JiraApiToken}"))
$headers = @{
    "Authorization" = "Basic $base64AuthInfo"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Function to create a Jira issue
function Create-JiraIssue {
    param(
        [string]$Summary,
        [string]$Description,
        [string]$IssueType,
        [string]$EpicKey = $null,
        [string]$Status = "To Do",
        [array]$Labels = @()
    )
    
    $body = @{
        fields = @{
            project = @{
                key = $ProjectKey
            }
            summary = $Summary
            description = @{
                type = "doc"
                version = 1
                content = @(
                    @{
                        type = "paragraph"
                        content = @(
                            @{
                                type = "text"
                                text = $Description
                            }
                        )
                    }
                )
            }
            issuetype = @{
                name = $IssueType
            }
            labels = $Labels
        }
    }
    
    # Add epic link if provided (for stories)
    if ($EpicKey) {
        $body.fields.parent = @{
            key = $EpicKey
        }
    }
    
    $bodyJson = $body | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/issue" -Method Post -Headers $headers -Body $bodyJson
        Write-Host "✓ Created: $Summary ($($response.key))" -ForegroundColor Green
        return $response.key
    }
    catch {
        Write-Host "✗ Failed to create: $Summary" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to transition issue to status
function Set-JiraIssueStatus {
    param(
        [string]$IssueKey,
        [string]$Status
    )
    
    # Map status names to transition IDs (you may need to adjust these)
    $statusMap = @{
        "To Do" = "11"
        "In Progress" = "21"
        "Done" = "31"
    }
    
    if ($Status -eq "To Do") {
        return # Default status, no need to transition
    }
    
    $transitionId = $statusMap[$Status]
    if (-not $transitionId) {
        Write-Host "⚠ Unknown status: $Status" -ForegroundColor Yellow
        return
    }
    
    $body = @{
        transition = @{
            id = $transitionId
        }
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/issue/$IssueKey/transitions" -Method Post -Headers $headers -Body $body
        Write-Host "  → Status: $Status" -ForegroundColor Cyan
    }
    catch {
        Write-Host "  ⚠ Could not set status to $Status" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Creating Jira Issues for AdanBrowser ===" -ForegroundColor Cyan
Write-Host "Project: $ProjectKey" -ForegroundColor Cyan
Write-Host "Epics: $($data.epics.Count)" -ForegroundColor Cyan
Write-Host "Total Stories: $($data.metadata.totalStories)`n" -ForegroundColor Cyan

$epicMapping = @{}

# Create each epic and its stories
foreach ($epic in $data.epics) {
    Write-Host "`n--- Epic: $($epic.summary) ---" -ForegroundColor Yellow
    
    # Create epic
    $epicKey = Create-JiraIssue `
        -Summary $epic.summary `
        -Description $epic.description `
        -IssueType "Epic" `
        -Labels @("adanbrowser", "mvp")
    
    if ($epicKey) {
        $epicMapping[$epic.key] = $epicKey
        
        # Create stories for this epic
        foreach ($story in $epic.stories) {
            $storyKey = Create-JiraIssue `
                -Summary $story.summary `
                -Description $story.description `
                -IssueType "Story" `
                -EpicKey $epicKey `
                -Labels $story.labels
            
            if ($storyKey -and $story.status) {
                Set-JiraIssueStatus -IssueKey $storyKey -Status $story.status
            }
            
            Start-Sleep -Milliseconds 500  # Rate limiting
        }
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Epic mapping:" -ForegroundColor Cyan
$epicMapping.GetEnumerator() | ForEach-Object {
    Write-Host "  $($_.Key) → $($_.Value)"
}

Write-Host "`n✓ Jira import completed!" -ForegroundColor Green
Write-Host "`nView your issues at: $JiraUrl/browse/$ProjectKey`n" -ForegroundColor Cyan
