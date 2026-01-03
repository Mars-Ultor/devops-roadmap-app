import { AARService } from '../services/aarService.js';
import { AARFormData, AARValidationResult } from '../types/aar.js';

describe('AARService', () => {
  let aarService: AARService;

  beforeEach(() => {
    aarService = new AARService();
  });

  describe('validateAARForm', () => {
    it('should validate a complete and valid AAR form', async () => {
      const validFormData: AARFormData = {
        whatWasAccomplished: 'I successfully completed the Docker containerization task by creating a multi-stage Dockerfile that optimized the image size and improved build performance. This involved understanding the different stages of the build process, selecting appropriate base images, and ensuring that the final image contained only the necessary runtime dependencies. The multi-stage approach allowed me to separate the build environment from the runtime environment, resulting in a significantly smaller final image size. I also learned how to use build arguments and environment variables effectively within the Dockerfile. The task required careful consideration of security best practices, such as running the application as a non-root user and minimizing the attack surface by removing unnecessary packages from the final image. Overall, this hands-on experience reinforced my understanding of containerization principles and their importance in modern software deployment pipelines.',
        whatWorkedWell: [
          'Following the step-by-step guide helped me understand each command',
          'The examples were clear and relevant to real-world scenarios',
          'Testing the container locally before deployment was crucial'
        ],
        whatDidNotWork: [
          'Initial confusion with volume mounting syntax',
          'Network configuration took longer than expected'
        ],
        whyDidNotWork: 'The volume mounting syntax was not immediately clear from the documentation, and the network configuration required understanding Docker networking concepts that were not covered in the prerequisite lessons. Additionally, the error messages from Docker were not always descriptive enough to quickly identify the root cause of configuration issues.',
        whatWouldIDoDifferently: 'I would review Docker networking fundamentals before starting the containerization task, and I would test volume mounting with simpler examples first. Also, I would spend more time reading through Docker documentation and experimenting with basic commands before attempting complex multi-stage builds.',
        whatDidILearn: 'I learned the importance of multi-stage builds for optimizing container images, how to properly configure Docker networks, and the best practices for volume management in containerized applications. I also gained experience with security considerations in containerization and the benefits of using smaller base images.'
      };

      const result: AARValidationResult = await aarService.validateAARForm(validFormData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
      expect(result.wordCounts.whatWasAccomplished).toBeGreaterThan(50);
      expect(result.wordCounts.whyDidNotWork).toBeGreaterThan(30);
      expect(result.wordCounts.whatWouldIDoDifferently).toBeGreaterThan(30);
      expect(result.wordCounts.whatDidILearn).toBeGreaterThan(30);
    });

    it('should reject AAR form with insufficient word count', async () => {
      const invalidFormData: AARFormData = {
        whatWasAccomplished: 'Short description',
        whatWorkedWell: ['Good'],
        whatDidNotWork: ['Bad'],
        whyDidNotWork: 'Too short',
        whatWouldIDoDifferently: 'Try harder',
        whatDidILearn: 'Something'
      };

      const result: AARValidationResult = await aarService.validateAARForm(invalidFormData);

      expect(result.isValid).toBe(false);
      expect(result.errors.whatWasAccomplished).toContain('50 words required');
      expect(result.errors.whyDidNotWork).toContain('30 words required');
      expect(result.errors.whatWorkedWell).toContain('3 items required');
      expect(result.errors.whatDidNotWork).toContain('2 items required');
    });

    it('should reject AAR form with empty items in arrays', async () => {
      const invalidFormData: AARFormData = {
        whatWasAccomplished: 'I completed the task successfully with proper planning and execution. The documentation was helpful and the examples were clear. I followed all the steps carefully and tested thoroughly.',
        whatWorkedWell: ['Good work', '', '   ', 'Another good point'],
        whatDidNotWork: ['Issue 1', ''],
        whyDidNotWork: 'The main issue was with the configuration setup which took longer than expected due to unfamiliar syntax and lack of clear examples in the documentation.',
        whatWouldIDoDifferently: 'Next time I would spend more time reading the documentation thoroughly and practice with simpler examples before attempting the full implementation.',
        whatDidILearn: 'I learned the importance of understanding the underlying concepts before diving into implementation, and the value of thorough testing at each step.'
      };

      const result: AARValidationResult = await aarService.validateAARForm(invalidFormData);

      expect(result.isValid).toBe(false);
      expect(result.errors.whatWorkedWell).toContain('All items must have content');
      expect(result.errors.whatDidNotWork).toContain('All items must have content');
    });

    it('should validate minimum array lengths', async () => {
      const invalidFormData: AARFormData = {
        whatWasAccomplished: 'I completed the task successfully with proper planning and execution. The documentation was helpful and the examples were clear. I followed all the steps carefully and tested thoroughly.',
        whatWorkedWell: ['Only one item'],
        whatDidNotWork: ['Only one issue'],
        whyDidNotWork: 'The main issue was with the configuration setup which took longer than expected due to unfamiliar syntax and lack of clear examples in the documentation.',
        whatWouldIDoDifferently: 'Next time I would spend more time reading the documentation thoroughly and practice with simpler examples before attempting the full implementation.',
        whatDidILearn: 'I learned the importance of understanding the underlying concepts before diving into implementation, and the value of thorough testing at each step.'
      };

      const result: AARValidationResult = await aarService.validateAARForm(invalidFormData);

      expect(result.isValid).toBe(false);
      expect(result.errors.whatWorkedWell).toContain('3 items required');
      expect(result.errors.whatDidNotWork).toContain('2 items required');
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      const service = new AARService();

      expect(service['countWords']('Hello world')).toBe(2);
      expect(service['countWords']('Single')).toBe(1);
      expect(service['countWords']('')).toBe(0);
      expect(service['countWords']('  Multiple   spaces   between   words  ')).toBe(4);
      expect(service['countWords']('Word-with-hyphens')).toBe(1);
      expect(service['countWords']('Word.with.periods')).toBe(1);
    });
  });
});