<#
    By default, can runs out ephemeral ports when running intensive Selenium tests

    Symptom:
        Uncaught Error: EADDRINUSE connect EADDRINUSE 127.0.0.1:57941 

    Multiple threads are complaining about this:
    - https://github.com/seleniumhq/selenium/issues/2888
    - https://serverfault.com/questions/648424/windows-server-2012-r2-runs-out-of-ephemeral-ports-though-it-shouldnt/858924#858924

    For the moment suggestions are:
    - enabling keep-alive on ChromeDriver calls (not sure it is feasible yet)
    - tweak windows configuration
    => This is the mission on this script
#>

Get-Item 'HKLM:\System\CurrentControlSet\Services\Tcpip\Parameters' | New-ItemProperty -Name MaxUserPort -Value 65534 -Force | Out-Null
Get-Item 'HKLM:\System\CurrentControlSet\Services\Tcpip\Parameters' | New-ItemProperty -Name TcpTimedWaitDelay -Value 30 -Force | Out-Null
Get-Item 'HKLM:\System\CurrentControlSet\Services\Tcpip\Parameters' | New-ItemProperty -Name TcpNumConnections -Value 16777214 -Force | Out-Null
Get-Item 'HKLM:\System\CurrentControlSet\Services\Tcpip\Parameters' | New-ItemProperty -Name TcpMaxDataRetransmissions -Value 5 -Force | Out-Null

shutdown -r -t 0
