$ErrorActionPreference = 'Stop'

$backendPath = Join-Path $PSScriptRoot 'backend'
$frontendPath = Join-Path $PSScriptRoot 'frontend'

Write-Host 'Starting STACKMIND backend on http://localhost:5000...'
$backend = Start-Process -FilePath 'npm.cmd' -ArgumentList 'start' -WorkingDirectory $backendPath -PassThru

Write-Host 'Starting STACKMIND frontend on http://localhost:5173...'
$frontend = Start-Process -FilePath 'npm.cmd' -ArgumentList 'run dev' -WorkingDirectory $frontendPath -PassThru

Write-Host "Backend PID: $($backend.Id)"
Write-Host "Frontend PID: $($frontend.Id)"
Write-Host 'Press Ctrl+C to stop this launcher. Close the terminal if a child process keeps running.'

try {
  Wait-Process -Id $backend.Id, $frontend.Id
} catch {
  Write-Host 'Launcher stopped.'
}
