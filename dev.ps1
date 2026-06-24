# ==============================================================================
# Stockify - Quick Start Panel (PowerShell)
# Author: Antigravity AI Coding Assistant
# Description: Native PowerShell script to check requirements, install deps,
#              and run frontend, backend, and ML services.
# ==============================================================================

# Set console encoding to UTF-8 to support nice block characters and emojis
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Unicode characters defined via code points to prevent encoding/parsing issues
$EmojiRocket    = [char]::ConvertFromUtf32(0x1F680)
$EmojiLaptop    = [char]::ConvertFromUtf32(0x1F4BB)
$EmojiTools     = [char]::ConvertFromUtf32(0x1F6E0)
$EmojiRobot     = [char]::ConvertFromUtf32(0x1F916)
$EmojiGlobe     = [char]::ConvertFromUtf32(0x1F310)
$EmojiSearch    = [char]::ConvertFromUtf32(0x1F50D)
$EmojiStop      = [char]::ConvertFromUtf32(0x1F6D1)
$EmojiDoor      = [char]::ConvertFromUtf32(0x1F6AA)
$EmojiWarning   = [string][char]0x26A0
$EmojiCross     = [string][char]0x274C
$CharCheck      = [string][char]0x2713
$CharDotFilled  = [string][char]0x25CF
$CharDotEmpty   = [string][char]0x25CB
$CharPointer    = [string][char]0x25BA

# Box Drawing characters
$BoxTL = [string][char]0x250C # ┌
$BoxTR = [string][char]0x2510 # ┐
$BoxBL = [string][char]0x2514 # └
$BoxBR = [string][char]0x2518 # ┘
$BoxV  = [string][char]0x2502 # │
$BoxH  = [string][char]0x2500 # ─
$BoxT  = [string][char]0x251C # ├
$BoxR  = [string][char]0x2524 # ┤

# Base directories
$BackendDir = "$PSScriptRoot\backend"
$MlDir = "$PSScriptRoot\ml"
$FrontendDir = "$PSScriptRoot\frontend"

# Ports used by services
$BackendPort = 3060
$MlPort = 8000
$FrontendPort = 3000

# Helper function to check if a port is in use
function Get-PortStatus {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" }
    if ($connection) {
        return $true
    }
    return $false
}

# Helper to find Python
function Get-PythonCmd {
    if (Get-Command python3 -ErrorAction SilentlyContinue) {
        return "python3"
    } elseif (Get-Command python -ErrorAction SilentlyContinue) {
        return "python"
    }
    return $null
}

# Helper to find Pip
function Get-PipCmd {
    if (Get-Command pip3 -ErrorAction SilentlyContinue) {
        return "pip3"
    } elseif (Get-Command pip -ErrorAction SilentlyContinue) {
        return "pip"
    }
    return $null
}

# Check system tools
function Check-Requirements {
    Write-Host "Checking System Requirements..." -ForegroundColor Yellow
    
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeVer = (node -v).Trim()
        Write-Host "  [OK] Node.js: $nodeVer" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] Node.js is NOT installed (Required for Frontend and Backend)" -ForegroundColor Red
    }

    if (Get-Command yarn -ErrorAction SilentlyContinue) {
        $yarnVer = (yarn -v).Trim()
        Write-Host "  [OK] Yarn: $yarnVer" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] Yarn is NOT installed (Required for Frontend and Backend)" -ForegroundColor Red
    }

    $py = Get-PythonCmd
    if ($py) {
        $pyVer = (& $py --version 2>&1).Trim()
        Write-Host "  [OK] Python ($py): $pyVer" -ForegroundColor Green
        if (-not (Test-Path "$MlDir\venv")) {
            Write-Host "  [WARN] Python Virtual Env (venv) is NOT created in ml/venv" -ForegroundColor Yellow
        } else {
            Write-Host "  [OK] Python Virtual Env (venv) detected" -ForegroundColor Green
        }
    } else {
        Write-Host "  [ERROR] Python is NOT installed (Required for ML Server)" -ForegroundColor Red
    }

    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Host "  [OK] Docker is installed" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Docker is NOT running or installed (Optional, but needed for Databases)" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Check environment files
function Check-Env {
    Write-Host "Checking Environment Files (.env)..." -ForegroundColor Yellow
    
    # Backend .env
    if (Test-Path "$BackendDir\.env") {
        Write-Host "  [OK] backend/.env exists" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] backend/.env is missing" -ForegroundColor Yellow
        if (Test-Path "$BackendDir\.env.example") {
            Write-Host "      -> Copying backend/.env.example to backend/.env..." -ForegroundColor Gray
            Copy-Item "$BackendDir\.env.example" "$BackendDir\.env"
        }
    }

    # Frontend .env
    if (Test-Path "$FrontendDir\.env") {
        Write-Host "  [OK] frontend/.env exists" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] frontend/.env is missing" -ForegroundColor Yellow
        Write-Host "      -> Creating default frontend/.env..." -ForegroundColor Gray
        Set-Content -Path "$FrontendDir\.env" -Value "NEXT_PUBLIC_STATIC_API_URL=http://localhost:3060/v1/api"
    }

    # ML .env
    if (Test-Path "$MlDir\.env") {
        Write-Host "  [OK] ml/.env exists" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] ml/.env is missing" -ForegroundColor Yellow
        Write-Host "      -> Creating default ml/.env..." -ForegroundColor Gray
        $defaultEnv = @(
            "PORT=8000",
            "HOST=0.0.0.0"
        )
        Set-Content -Path "$MlDir\.env" -Value $defaultEnv
    }
    Write-Host ""
}

# Install dependencies
function Install-Dependencies {
    Write-Host "Installing All Dependencies..." -ForegroundColor Blue
    
    Write-Host "`n--- Backend (yarn install) ---" -ForegroundColor Cyan
    Push-Location $BackendDir
    yarn install
    Pop-Location
    
    Write-Host "`n--- Frontend (yarn install) ---" -ForegroundColor Cyan
    Push-Location $FrontendDir
    yarn install
    Pop-Location
    
    # ML Server python dependencies
    Write-Host "`n--- Python ML Server environment ---" -ForegroundColor Cyan
    $py = Get-PythonCmd
    if ($py) {
        if (-not (Test-Path "$MlDir\venv")) {
            Write-Host "Creating Python Virtual Environment (venv) in ml/venv..." -ForegroundColor Gray
            Push-Location $MlDir
            & $py -m venv venv
            Pop-Location
        }
        
        Push-Location $MlDir
        if (Test-Path "venv/Scripts/pip.exe") {
            Write-Host "  Using virtual environment pip..." -ForegroundColor Green
            & venv/Scripts/pip.exe install -r requirements.txt
        } else {
            $pip = Get-PipCmd
            if ($pip) {
                Write-Host "  Using global pip ($pip)..." -ForegroundColor Yellow
                & $pip install -r requirements.txt
            } else {
                Write-Host "  [ERROR] Pip not found." -ForegroundColor Red
            }
        }
        Pop-Location
    } else {
        Write-Host "  [ERROR] Python is not installed, skipping ML setup." -ForegroundColor Red
    }
    
    Write-Host "`nDependencies installation completed successfully!" -ForegroundColor Green
}

# Helper to run Docker compose database
function Start-DockerDatabases {
    if (Test-Path "docker-compose.yml") {
        if (Get-Command docker -ErrorAction SilentlyContinue) {
            Write-Host "Starting Database via Docker Compose..." -ForegroundColor Green
            docker compose up -d mssql 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Host "`n[!] Docker Compose reported an error (likely a container name conflict)." -ForegroundColor Yellow
                Write-Host "    If 'stockify-db' is already in use, run the following command to resolve:" -ForegroundColor Yellow
                Write-Host "    docker rm -f stockify-db" -ForegroundColor Cyan
                Write-Host "    Then try running the database option again.`n" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  [WARN] Docker not found or not running. Cannot start DB." -ForegroundColor Yellow
        }
    }
}

# Show dynamic service status
function Show-ServiceStatus {
    $border = $BoxH * 46
    Write-Host "$BoxTL$border$BoxTR" -ForegroundColor Cyan
    Write-Host "$BoxV                SERVICES STATUS               $BoxV" -ForegroundColor Cyan
    Write-Host "$BoxT$border$BoxR" -ForegroundColor Cyan
    
    # Backend
    if (Get-PortStatus -Port $BackendPort) {
        Write-Host "$BoxV  [$CharDotFilled] Backend (Port $BackendPort)      : " -NoNewline -ForegroundColor Cyan
        Write-Host "RUNNING      " -ForegroundColor Green -NoNewline
        Write-Host "$BoxV" -ForegroundColor Cyan
    } else {
        Write-Host "$BoxV  [$CharDotEmpty] Backend (Port $BackendPort)      : " -NoNewline -ForegroundColor Cyan
        Write-Host "STOPPED      " -ForegroundColor Red -NoNewline
        Write-Host "$BoxV" -ForegroundColor Cyan
    }
    
    # ML Server
    if (Get-PortStatus -Port $MlPort) {
        Write-Host "$BoxV  [$CharDotFilled] ML Server (Port $MlPort)     : " -NoNewline -ForegroundColor Cyan
        Write-Host "RUNNING      " -ForegroundColor Green -NoNewline
        Write-Host "$BoxV" -ForegroundColor Cyan
    } else {
        Write-Host "$BoxV  [$CharDotEmpty] ML Server (Port $MlPort)     : " -NoNewline -ForegroundColor Cyan
        Write-Host "STOPPED      " -ForegroundColor Red -NoNewline
        Write-Host "$BoxV" -ForegroundColor Cyan
    }
    
    # Frontend
    if (Get-PortStatus -Port $FrontendPort) {
        Write-Host "$BoxV  [$CharDotFilled] Frontend (Port $FrontendPort)    : " -NoNewline -ForegroundColor Cyan
        Write-Host "RUNNING      " -ForegroundColor Green -NoNewline
        Write-Host "$BoxV" -ForegroundColor Cyan
    } else {
        Write-Host "$BoxV  [$CharDotEmpty] Frontend (Port $FrontendPort)    : " -NoNewline -ForegroundColor Cyan
        Write-Host "STOPPED      " -ForegroundColor Red -NoNewline
        Write-Host "$BoxV" -ForegroundColor Cyan
    }
    Write-Host "$BoxBL$border$BoxBR" -ForegroundColor Cyan
}

function Stop-ServiceByPort {
    param([int]$Port)
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $pidToKill = $conn.OwningProcess
            if ($pidToKill) {
                Write-Host "Stopping process $pidToKill listening on port $Port..." -ForegroundColor Yellow
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

function Stop-AllServices {
    Write-Host "`n$EmojiStop Stopping all services..." -ForegroundColor Red
    Stop-ServiceByPort -Port $BackendPort
    Stop-ServiceByPort -Port $MlPort
    Stop-ServiceByPort -Port $FrontendPort
    Write-Host "$CharCheck Done. All services stopped." -ForegroundColor Green
}

function Check-PortsBeforeStart {
    $inUse = @()
    if (Get-PortStatus -Port $BackendPort) { $inUse += "Backend (Port $BackendPort)" }
    if (Get-PortStatus -Port $MlPort) { $inUse += "ML Server (Port $MlPort)" }
    if (Get-PortStatus -Port $FrontendPort) { $inUse += "Frontend (Port $FrontendPort)" }
    
    if ($inUse.Count -gt 0) {
        Write-Host "`n$EmojiWarning Warning: The following ports are already in use:" -ForegroundColor Yellow
        foreach ($item in $inUse) {
            Write-Host "   - $item" -ForegroundColor Yellow
        }
        $answer = Read-Host "Would you like to stop them first? (y/N)"
        if ($answer -eq 'y' -or $answer -eq 'Y') {
            Stop-AllServices
            Start-Sleep -Seconds 1
        }
    }
}

# Pre-defined literal commands for running
$BackendCmd  = '$Host.UI.RawUI.WindowTitle = ''Backend''; yarn start:dev'
$MlCmd = if (Test-Path "$MlDir\venv\Scripts\python.exe") {
    '$Host.UI.RawUI.WindowTitle = ''ML Server''; .\venv\Scripts\python.exe -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload'
} else {
    '$Host.UI.RawUI.WindowTitle = ''ML Server''; python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload'
}
$FrontendCmd = '$Host.UI.RawUI.WindowTitle = ''Frontend''; yarn run dev'

# Start all services in separate PowerShell windows
function Start-AllWindows {
    Check-PortsBeforeStart
    Write-Host "Starting all services in separate PowerShell windows..." -ForegroundColor Cyan
    
    # Start DB
    Start-DockerDatabases

    # Spawning Backend
    Write-Host "Spawning Backend window..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendDir'; $BackendCmd"

    # Spawning ML Server
    Write-Host "Spawning ML Server window..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$MlDir'; $MlCmd"

    # Spawning Frontend
    Write-Host "Spawning Frontend window..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendDir'; $FrontendCmd"

    Write-Host "`nAll services have been started in separate windows." -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Start all services as background jobs in the current console
function Start-AllJobs {
    Check-PortsBeforeStart
    Write-Host "Starting all services as background jobs..." -ForegroundColor Cyan
    
    # Start DB
    Start-DockerDatabases

    $jobs = @()
    
    $jobs += Start-Job -Name "Backend" -ScriptBlock { param($dir, $cmd) cd $dir; Invoke-Expression $cmd } -ArgumentList $BackendDir, $BackendCmd
    $jobs += Start-Job -Name "ML-Server" -ScriptBlock { param($dir, $cmd) cd $dir; Invoke-Expression $cmd } -ArgumentList $MlDir, $MlCmd
    $jobs += Start-Job -Name "Frontend" -ScriptBlock { param($dir, $cmd) cd $dir; Invoke-Expression $cmd } -ArgumentList $FrontendDir, $FrontendCmd

    Write-Host "All services started as background jobs. Press Ctrl+C to stop all." -ForegroundColor Green
    Write-Host "Current Background Jobs:" -ForegroundColor Yellow
    Get-Job

    try {
        while ($true) {
            foreach ($job in $jobs) {
                $data = Receive-Job -Job $job
                if ($data) {
                    Write-Host "[$($job.Name)]: $data"
                }
            }
            Start-Sleep -Milliseconds 500
        }
    }
    finally {
        Write-Host "`nStopping all background jobs..." -ForegroundColor Red
        $jobs | Stop-Job
        $jobs | Remove-Job
        Write-Host "All jobs terminated successfully." -ForegroundColor Green
    }
}

# Print Header Block
function Print-Header {
    Clear-Host
    $sep = $BoxH * 57
    Write-Host $sep -ForegroundColor Cyan
    Write-Host "   _____ _____ ___   ___ _  _____ ___ _   _ " -ForegroundColor Cyan
    Write-Host "  /  ___|_   _/ _ \ / __| |/ /_ _|  __(_) \_/" -ForegroundColor Cyan
    Write-Host "  \___ \  | || (_) | (__| ' < | || _| |  |  " -ForegroundColor Cyan
    Write-Host "  |____/  |_| \___/ \___|_|\_\___|_|  |_/ \_/" -ForegroundColor Cyan
    Write-Host $sep -ForegroundColor Cyan
    Write-Host "            STOCKIFY DEVELOPER ENVIRONMENT MANAGER       " -ForegroundColor Yellow
    Write-Host $sep -ForegroundColor Cyan
    Write-Host ""
}

# Show initial diagnostic screen
Print-Header
Check-Requirements
Check-Env

# Menu loop
while ($true) {
    Write-Host "--- SELECT A SERVICE TO RUN ---" -ForegroundColor Cyan
    Write-Host "  [1] Start NestJS Backend (Dev Mode)"
    Write-Host "  [2] Start FastAPI ML Server (Uvicorn Dev Mode)"
    Write-Host "  [3] Start Frontend App (Next.js Dev Mode)"
    Write-Host "  [4] Start Database only (Docker Compose)"
    Write-Host "  [5] Start ALL Services (Separate PowerShell Windows)"
    Write-Host "  [6] Start ALL Services (Combined Background - current terminal)"
    Write-Host "  [7] Re-check environment and verify system tools"
    Write-Host "  [8] Install/Update Dependencies for ALL Services"
    Write-Host "  [9] Stop All Running Services"
    Write-Host "  [0] Exit"
    Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
    
    $choice = Read-Host "$CharPointer Enter choice [0-9]"
    Write-Host ""

    switch ($choice) {
        "1" {
            Check-PortsBeforeStart
            Write-Host "Starting NestJS Backend..." -ForegroundColor Cyan
            Push-Location $BackendDir
            Invoke-Expression $BackendCmd
            Pop-Location
            break
        }
        "2" {
            Check-PortsBeforeStart
            Write-Host "Starting Python FastAPI ML Server..." -ForegroundColor Cyan
            Push-Location $MlDir
            Invoke-Expression $MlCmd
            Pop-Location
            break
        }
        "3" {
            Check-PortsBeforeStart
            Write-Host "Starting Next.js Frontend..." -ForegroundColor Cyan
            Push-Location $FrontendDir
            Invoke-Expression $FrontendCmd
            Pop-Location
            break
        }
        "4" {
            Start-DockerDatabases
            Read-Host "Press Enter to continue..."
        }
        "5" {
            Start-AllWindows
        }
        "6" {
            Start-AllJobs
            break
        }
        "7" {
            Print-Header
            Check-Requirements
            Check-Env
        }
        "8" {
            Install-Dependencies
            Read-Host "Press Enter to continue..."
        }
        "9" {
            Stop-AllServices
            Read-Host "Press Enter to continue..."
        }
        "0" {
            Write-Host "Goodbye!" -ForegroundColor Green
            exit 0
        }
        Default {
            Write-Host "Invalid option, please choose between 0 and 9." -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
    Print-Header
}
