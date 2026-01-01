# PowerShell script to fix Week 8 lesson files structure

$clientPath = "E:\Projects\devops-roadmap-app\client\src\data"

# Fix week8Lesson2PrometheusGrafana.ts - Remove extra closing brace and add relatedConcepts
$file2 = Join-Path $clientPath "week8Lesson2PrometheusGrafana.ts"
$content2 = Get-Content $file2 -Raw

# Fix the documentation array structure by removing the extra closing brace
$content2 = $content2 -replace "    \]\s*}\s*};", @"
  ],
  relatedConcepts: [
    'RED methodology (Rate, Errors, Duration)',
    'USE methodology (Utilization, Saturation, Errors)',
    'PromQL query language',
    'Service discovery patterns',
    'SLO-based alerting',
    'Time-series databases'
  ]
};
"@

Set-Content -Path $file2 -Value $content2 -NoNewline

Write-Host "Fixed week8Lesson2PrometheusGrafana.ts structure"

# Fix week8Lesson3LogAggregation.ts - Similar fix
$file3 = Join-Path $clientPath "week8Lesson3LogAggregation.ts"
$content3 = Get-Content $file3 -Raw

# Fix the documentation array structure
$content3 = $content3 -replace "    \]\s*}\s*};", @"
  ],
  relatedConcepts: [
    'Centralized logging architectures',
    'Log aggregation patterns',
    'Structured logging best practices',
    'Log retention and compliance',
    'ELK vs Loki trade-offs',
    'LogQL and KQL query languages'
  ]
};
"@

Set-Content -Path $file3 -Value $content3 -NoNewline

Write-Host "Fixed week8Lesson3LogAggregation.ts structure"

Write-Host "All Week 8 files fixed!"
