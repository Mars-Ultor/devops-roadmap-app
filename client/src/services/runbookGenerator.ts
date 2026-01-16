/**
 * Personal Runbook Auto-Generation Service
 * Aggregates failure logs into organized troubleshooting guide
 */

interface FailureEntry {
  id: string;
  entryNumber: number;
  task: string;
  whatBroke: string;
  whatTried: string[];
  rootCause: string;
  solution: string;
  timeWasted: number;
  keyLesson: string;
  prevention: string;
  quickCheck: string;
  category: string;
  createdAt: Date;
}

export interface RunbookCategory {
  category: string;
  icon: string;
  entries: RunbookEntry[];
  totalOccurrences: number;
}

export interface RunbookEntry {
  problem: string;
  occurrences: number;
  lastSeen: Date;
  rootCause: string;
  solution: string;
  prevention: string;
  quickCheck: string;
  relatedFailures: string[]; // IDs of similar failures
}

export interface PersonalRunbookData {
  categories: RunbookCategory[];
  totalFailures: number;
  mostCommonIssue: string;
  recentPatterns: string[];
  generatedAt: Date;
}

// Category keyword mappings for failure categorization
const CATEGORY_KEYWORDS: Array<{ keywords: string[]; category: string }> = [
  { keywords: ['docker', 'container'], category: 'Docker & Containers' },
  { keywords: ['kubernetes', 'k8s', 'kubectl'], category: 'Kubernetes' },
  { keywords: ['git', 'merge', 'commit'], category: 'Git & Version Control' },
  { keywords: ['ci/cd', 'pipeline', 'jenkins', 'github actions'], category: 'CI/CD & Automation' },
  { keywords: ['network', 'port', 'connection', 'dns'], category: 'Networking' },
  { keywords: ['permission', 'auth', 'security', 'access denied'], category: 'Security & Permissions' },
  { keywords: ['database', 'sql', 'mongodb', 'postgres'], category: 'Databases' },
  { keywords: ['deploy', 'deployment'], category: 'Deployment' },
  { keywords: ['linux', 'bash', 'shell', 'command'], category: 'Linux & Shell' },
  { keywords: ['terraform', 'infrastructure', 'iac'], category: 'Infrastructure as Code' }
];

/**
 * Categorize failure by technology/domain
 */
function categorizeFailure(failure: FailureEntry): string {
  const whatBroke = failure.whatBroke.toLowerCase();
  const task = failure.task?.toLowerCase() || '';
  const combined = whatBroke + ' ' + task;
  
  for (const { keywords, category } of CATEGORY_KEYWORDS) {
    if (keywords.some(kw => combined.includes(kw))) {
      return category;
    }
  }
  
  return 'General';
}

/**
 * Aggregate failures into runbook entries
 */
function aggregateFailures(failures: FailureEntry[]): Map<string, RunbookEntry> {
  const problemMap = new Map<string, RunbookEntry>();
  
  for (const failure of failures) {
    // Use root cause as the key for aggregation (similar root causes = same entry)
    const key = failure.rootCause.toLowerCase().trim();
    
    const existing = problemMap.get(key);
    
    if (existing) {
      // Update existing entry
      existing.occurrences++;
      if (failure.createdAt > existing.lastSeen) {
        existing.lastSeen = failure.createdAt;
        // Update with most recent solution
        existing.solution = failure.solution;
        existing.prevention = failure.prevention;
        existing.quickCheck = failure.quickCheck || 'No quick check provided';
      }
      existing.relatedFailures.push(failure.id);
    } else {
      // Create new entry
      problemMap.set(key, {
        problem: failure.whatBroke,
        occurrences: 1,
        lastSeen: failure.createdAt,
        rootCause: failure.rootCause,
        solution: failure.solution,
        prevention: failure.prevention,
        quickCheck: failure.quickCheck || 'No quick check provided',
        relatedFailures: [failure.id]
      });
    }
  }
  
  return problemMap;
}

/**
 * Generate personal runbook from failure logs
 */
export function generatePersonalRunbook(failures: FailureEntry[]): PersonalRunbookData {
  if (failures.length === 0) {
    return {
      categories: [],
      totalFailures: 0,
      mostCommonIssue: 'No failures logged yet',
      recentPatterns: [],
      generatedAt: new Date()
    };
  }
  
  // Categorize all failures
  const categoryMap = new Map<string, FailureEntry[]>();
  
  for (const failure of failures) {
    const category = categorizeFailure(failure);
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(failure);
  }
  
  // Get category icons
  const categoryIcons: Record<string, string> = {
    'Docker & Containers': '🐳',
    'Kubernetes': '☸️',
    'Git & Version Control': '🔀',
    'CI/CD & Automation': '🔄',
    'Networking': '🌐',
    'Security & Permissions': '🔒',
    'Databases': '🗄️',
    'Deployment': '🚀',
    'Linux & Shell': '🐧',
    'Infrastructure as Code': '🏗️',
    'General': '⚙️'
  };
  
  // Build categories
  const categories: RunbookCategory[] = [];
  
  for (const [categoryName, categoryFailures] of categoryMap.entries()) {
    const aggregatedEntries = aggregateFailures(categoryFailures);
    
    // Sort by occurrences (most common first), then by recency
    const sortedEntries = Array.from(aggregatedEntries.values()).sort((a, b) => {
      if (b.occurrences !== a.occurrences) {
        return b.occurrences - a.occurrences;
      }
      return b.lastSeen.getTime() - a.lastSeen.getTime();
    });
    
    categories.push({
      category: categoryName,
      icon: categoryIcons[categoryName] || '⚙️',
      entries: sortedEntries,
      totalOccurrences: categoryFailures.length
    });
  }
  
  // Sort categories by total occurrences
  categories.sort((a, b) => b.totalOccurrences - a.totalOccurrences);
  
  // Find most common issue
  let mostCommon = categories[0]?.entries[0];
  for (const cat of categories) {
    for (const entry of cat.entries) {
      if (!mostCommon || entry.occurrences > mostCommon.occurrences) {
        mostCommon = entry;
      }
    }
  }
  
  // Identify recent patterns (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentFailures = failures.filter(f => f.createdAt >= thirtyDaysAgo);
  const recentCategories = new Map<string, number>();
  
  for (const failure of recentFailures) {
    const cat = categorizeFailure(failure);
    recentCategories.set(cat, (recentCategories.get(cat) || 0) + 1);
  }
  
  const recentPatterns = Array.from(recentCategories.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, count]) => `${cat} (${count} issues)`);
  
  return {
    categories,
    totalFailures: failures.length,
    mostCommonIssue: mostCommon?.problem || 'Unknown',
    recentPatterns,
    generatedAt: new Date()
  };
}

/**
 * Export runbook as Markdown
 */
export function exportRunbookAsMarkdown(runbook: PersonalRunbookData): string {
  let md = `# Personal DevOps Runbook\n\n`;
  md += `**Generated:** ${runbook.generatedAt.toLocaleDateString()} ${runbook.generatedAt.toLocaleTimeString()}\n`;
  md += `**Total Issues Logged:** ${runbook.totalFailures}\n\n`;
  
  if (runbook.totalFailures === 0) {
    md += `No failures logged yet. Keep learning!\n`;
    return md;
  }
  
  md += `## 📊 Summary\n\n`;
  md += `**Most Common Issue:** ${runbook.mostCommonIssue}\n\n`;
  
  if (runbook.recentPatterns.length > 0) {
    md += `**Recent Patterns (Last 30 Days):**\n`;
    for (const pattern of runbook.recentPatterns) {
      md += `- ${pattern}\n`;
    }
    md += `\n`;
  }
  
  md += `---\n\n`;
  
  // Categories
  for (const category of runbook.categories) {
    md += `## ${category.icon} ${category.category}\n\n`;
    md += `*Total occurrences: ${category.totalOccurrences}*\n\n`;
    
    for (let i = 0; i < category.entries.length; i++) {
      const entry = category.entries[i];
      md += `### ${i + 1}. ${entry.problem}\n\n`;
      md += `**Occurrences:** ${entry.occurrences} | **Last Seen:** ${entry.lastSeen.toLocaleDateString()}\n\n`;
      md += `**Root Cause:**\n${entry.rootCause}\n\n`;
      md += `**Solution:**\n${entry.solution}\n\n`;
      md += `**Prevention:**\n${entry.prevention}\n\n`;
      md += `**Quick Check:**\n\`\`\`bash\n${entry.quickCheck}\n\`\`\`\n\n`;
      md += `---\n\n`;
    }
  }
  
  md += `\n## 🎓 Generated by DevOps Roadmap App\n`;
  md += `This runbook is auto-generated from your personal failure logs. Keep it updated by logging every mistake!\n`;
  
  return md;
}

/**
 * Download runbook as file
 */
export function downloadRunbook(runbook: PersonalRunbookData, format: 'markdown' | 'text' = 'markdown') {
  const content = format === 'markdown' 
    ? exportRunbookAsMarkdown(runbook)
    : exportRunbookAsMarkdown(runbook); // For now, both are markdown
  
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `personal-runbook-${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
