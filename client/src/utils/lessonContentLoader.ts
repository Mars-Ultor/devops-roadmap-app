/**
 * Lesson Content Loader
 * Dynamically loads detailed lesson content for mastery-based learning
 */

import type { LeveledLessonContent } from '../types/lessonContent';

/**
 * Mapping from curriculum lesson IDs to lesson content exports
 */
const LESSON_CONTENT_MAP: Record<string, () => Promise<LeveledLessonContent>> = {
  // Week 1
  'week1-lesson1-what-is-devops': () => import('../data/week1Lesson1DevOps').then(m => m.week1Lesson1WhatIsDevOps),
  'week1-lesson2-linux-basics': () => import('../data/week1Lessons').then(m => m.week1Lesson2LinuxBasics),
  'week1-lesson3-bash-basics': () => import('../data/week1Lesson3Bash').then(m => m.week1Lesson3BashBasics),
  // Legacy short IDs for backward compatibility
  'w1-l1': () => import('../data/week1Lesson1DevOps').then(m => m.week1Lesson1WhatIsDevOps),
  'w1-l2': () => import('../data/week1Lessons').then(m => m.week1Lesson2LinuxBasics),
  'w1-l3': () => import('../data/week1Lesson3Bash').then(m => m.week1Lesson3BashBasics),

  // Week 2
  'week2-lesson1-git-basics': () => import('../data/week2Lessons').then(m => m.week2Lesson1GitBasics),
  'week2-lesson2-why-version-control': () => import('../data/week2Lesson2VersionControl').then(m => m.week2Lesson2WhyVersionControl),
  'week2-lesson3-github-workflow': () => import('../data/week2Lesson3GitHub').then(m => m.week2Lesson3GitHubWorkflow),
  // Legacy short IDs for backward compatibility
  'w2-l1': () => import('../data/week2Lessons').then(m => m.week2Lesson1GitBasics),
  'w2-l2': () => import('../data/week2Lesson2VersionControl').then(m => m.week2Lesson2WhyVersionControl),
  'w2-l3': () => import('../data/week2Lesson3GitHub').then(m => m.week2Lesson3GitHubWorkflow),

  // Week 3
  'week3-lesson1-cloud-concepts': () => import('../data/week3Lesson1CloudConcepts').then(m => m.week3Lesson1CloudConcepts),
  'week3-lesson2-aws-services': () => import('../data/week3Lesson2AWSServices').then(m => m.week3Lesson2AWSServices),
  'week3-lesson3-aws-cli': () => import('../data/week3Lesson3AWSCLI').then(m => m.week3Lesson3AWSCLI),
  // Legacy short IDs for backward compatibility
  'w3-l1': () => import('../data/week3Lesson1CloudConcepts').then(m => m.week3Lesson1CloudConcepts),
  'w3-l2': () => import('../data/week3Lesson2AWSServices').then(m => m.week3Lesson2AWSServices),
  'w3-l3': () => import('../data/week3Lesson3AWSCLI').then(m => m.week3Lesson3AWSCLI),

  // Week 4
  'week4-lesson1-why-containers': () => import('../data/week4Lesson1WhyContainers').then(m => m.week4Lesson1WhyContainers),
  'week4-lesson2-docker-basics': () => import('../data/week4Lessons').then(m => m.week4Lesson2DockerBasics),
  'week4-lesson3-docker-compose': () => import('../data/week4Lesson3DockerCompose').then(m => m.week4Lesson3DockerCompose),
  // Legacy short IDs for backward compatibility
  'w4-l1': () => import('../data/week4Lesson1WhyContainers').then(m => m.week4Lesson1WhyContainers),
  'w4-l2': () => import('../data/week4Lessons').then(m => m.week4Lesson2DockerBasics),
  'w4-l3': () => import('../data/week4Lesson3DockerCompose').then(m => m.week4Lesson3DockerCompose),

  // Week 5
  'week5-lesson1-cicd-concepts': () => import('../data/week5Lesson1CICDConcepts').then(m => m.week5Lesson1CICDConcepts),
  'week5-lesson2-github-actions': () => import('../data/week5Lesson2GitHubActions').then(m => m.week5Lesson2GitHubActions),
  'week5-lesson3-building-pipelines': () => import('../data/week5Lesson3BuildingPipelines').then(m => m.week5Lesson3BuildingPipelines),
  // Legacy short IDs for backward compatibility
  'w5-l1': () => import('../data/week5Lesson1CICDConcepts').then(m => m.week5Lesson1CICDConcepts),
  'w5-l2': () => import('../data/week5Lesson2GitHubActions').then(m => m.week5Lesson2GitHubActions),
  'w5-l3': () => import('../data/week5Lesson3BuildingPipelines').then(m => m.week5Lesson3BuildingPipelines),

  // Week 6
  'week6-lesson1-iac-concepts': () => import('../data/week6Lesson1IaCConcepts').then(m => m.week6Lesson1IaCConcepts),
  'week6-lesson2-terraform-basics': () => import('../data/week6Lesson2TerraformBasics').then(m => m.week6Lesson2TerraformBasics),
  'week6-lesson3-terraform-practice': () => import('../data/week6Lesson3TerraformPractice').then(m => m.week6Lesson3TerraformPractice),
  // Legacy short IDs for backward compatibility
  'w6-l1': () => import('../data/week6Lesson1IaCConcepts').then(m => m.week6Lesson1IaCConcepts),
  'w6-l2': () => import('../data/week6Lesson2TerraformBasics').then(m => m.week6Lesson2TerraformBasics),
  'w6-l3': () => import('../data/week6Lesson3TerraformPractice').then(m => m.week6Lesson3TerraformPractice),

  // Week 7
  'week7-lesson1-why-kubernetes': () => import('../data/week7Lesson1WhyKubernetes').then(m => m.week7Lesson1WhyKubernetes),
  'week7-lesson2-kubernetes-basics': () => import('../data/week7Lesson2KubernetesBasics').then(m => m.week7Lesson2KubernetesBasics),
  'week7-lesson3-deployments-services': () => import('../data/week7Lesson3DeploymentsServices').then(m => m.week7Lesson3DeploymentsServices),
  // Legacy short IDs for backward compatibility
  'w7-l1': () => import('../data/week7Lesson1WhyKubernetes').then(m => m.week7Lesson1WhyKubernetes),
  'w7-l2': () => import('../data/week7Lesson2KubernetesBasics').then(m => m.week7Lesson2KubernetesBasics),
  'w7-l3': () => import('../data/week7Lesson3DeploymentsServices').then(m => m.week7Lesson3DeploymentsServices),

  // Week 8
  'week8-lesson1-observability-concepts': () => import('../data/week8Lesson1ObservabilityConcepts').then(m => m.week8Lesson1ObservabilityConcepts),
  'week8-lesson2-prometheus-grafana': () => import('../data/week8Lesson2PrometheusGrafana').then(m => m.week8Lesson2PrometheusGrafana),
  'week8-lesson3-log-aggregation': () => import('../data/week8Lesson3LogAggregation').then(m => m.week8Lesson3LogAggregation),
  // Legacy short IDs for backward compatibility
  'w8-l1': () => import('../data/week8Lesson1ObservabilityConcepts').then(m => m.week8Lesson1ObservabilityConcepts),
  'w8-l2': () => import('../data/week8Lesson2PrometheusGrafana').then(m => m.week8Lesson2PrometheusGrafana),
  'w8-l3': () => import('../data/week8Lesson3LogAggregation').then(m => m.week8Lesson3LogAggregation),

  // Week 9
  'week9-lesson1-devsecops-fundamentals': () => import('../data/week9Lesson1DevSecOpsFundamentals').then(m => m.week9Lesson1DevSecOpsFundamentals),
  'week9-lesson2-container-security': () => import('../data/week9Lesson2ContainerSecurity').then(m => m.week9Lesson2ContainerSecurity),
  'week9-lesson3-infrastructure-security': () => import('../data/week9Lesson3InfrastructureSecurity').then(m => m.week9Lesson3InfrastructureSecurity),
  // Legacy short IDs for backward compatibility
  'w9-l1': () => import('../data/week9Lesson1DevSecOpsFundamentals').then(m => m.week9Lesson1DevSecOpsFundamentals),
  'w9-l2': () => import('../data/week9Lesson2ContainerSecurity').then(m => m.week9Lesson2ContainerSecurity),
  'w9-l3': () => import('../data/week9Lesson3InfrastructureSecurity').then(m => m.week9Lesson3InfrastructureSecurity),

  // Week 10
  'week10-lesson1-microservices-service-mesh': () => import('../data/week10Lesson1MicroservicesServiceMesh').then(m => m.week10Lesson1MicroservicesServiceMesh),
  'week10-lesson2-cloud-native-storage': () => import('../data/week10Lesson2CloudNativeStorage').then(m => m.week10Lesson2CloudNativeStorage),
  'week10-lesson3-advanced-deployments': () => import('../data/week10Lesson3AdvancedDeployments').then(m => m.week10Lesson3AdvancedDeployments),
  // Legacy short IDs for backward compatibility
  'w10-l1': () => import('../data/week10Lesson1MicroservicesServiceMesh').then(m => m.week10Lesson1MicroservicesServiceMesh),
  'w10-l2': () => import('../data/week10Lesson2CloudNativeStorage').then(m => m.week10Lesson2CloudNativeStorage),
  'w10-l3': () => import('../data/week10Lesson3AdvancedDeployments').then(m => m.week10Lesson3AdvancedDeployments),

  // Week 11
  'week11-lesson1-gitops-argocd': () => import('../data/week11Lesson1GitOpsArgoCD').then(m => m.week11Lesson1GitOpsArgoCD),
  'week11-lesson2-terraform-advanced': () => import('../data/week11Lesson2TerraformAdvanced').then(m => m.week11Lesson2TerraformAdvanced),
  'week11-lesson3-platform-engineering': () => import('../data/week11Lesson3PlatformEngineering').then(m => m.week11Lesson3PlatformEngineering),
  // Legacy short IDs for backward compatibility
  'w11-l1': () => import('../data/week11Lesson1GitOpsArgoCD').then(m => m.week11Lesson1GitOpsArgoCD),
  'w11-l2': () => import('../data/week11Lesson2TerraformAdvanced').then(m => m.week11Lesson2TerraformAdvanced),
  'w11-l3': () => import('../data/week11Lesson3PlatformEngineering').then(m => m.week11Lesson3PlatformEngineering),

  // Week 12
  'week12-lesson1-capstone-project': () => import('../data/week12Lesson1CapstoneProject').then(m => m.week12Lesson1CapstoneProject),
  'week12-lesson2-devops-career': () => import('../data/week12Lesson2DevOpsCareer').then(m => m.week12Lesson2DevOpsCareer),
  'week12-lesson3-continuous-learning': () => import('../data/week12Lesson3ContinuousLearning').then(m => m.week12Lesson3ContinuousLearning),
  // Legacy short IDs for backward compatibility
  'w12-l1': () => import('../data/week12Lesson1CapstoneProject').then(m => m.week12Lesson1CapstoneProject),
  'w12-l2': () => import('../data/week12Lesson2DevOpsCareer').then(m => m.week12Lesson2DevOpsCareer),
  'w12-l3': () => import('../data/week12Lesson3ContinuousLearning').then(m => m.week12Lesson3ContinuousLearning),
};

/**
 * Load detailed lesson content for a given lesson ID
 */
export async function loadLessonContent(lessonId: string): Promise<LeveledLessonContent | null> {
  const loader = LESSON_CONTENT_MAP[lessonId];
  if (!loader) {
    return null; // No detailed content available for this lesson
  }

  try {
    return await loader();
  } catch (error) {
    console.error(`Failed to load lesson content for ${lessonId}:`, error);
    return null;
  }
}

/**
 * Check if detailed content is available for a lesson
 */
export function hasDetailedContent(lessonId: string): boolean {
  return lessonId in LESSON_CONTENT_MAP;
}

/**
 * Get all available lesson IDs with detailed content
 */
export function getAvailableLessonIds(): string[] {
  return Object.keys(LESSON_CONTENT_MAP);
}