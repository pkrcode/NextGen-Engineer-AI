const express = require('express');
const router = express.Router();
const LearningPath = require('../models/LearningPath');
const UserProgress = require('../models/UserProgress');
const authMiddleware = require('../middleware/authMiddleware');
const unifiedAIService = require('../services/unifiedAIService');

// Auto-seed learning paths if none exist
const seedLearningPaths = async () => {
  const count = await LearningPath.countDocuments();
  if (count === 0) {
    console.log('Seeding initial learning paths...');
    const paths = [
      {
        title: 'Web Development Fundamentals',
        domain: 'Software Engineering',
        description: 'Master the basics of web development with HTML, CSS, and JavaScript',
        difficulty: 'beginner',
        estimatedDuration: { weeks: 8, hoursPerWeek: 10 },
        prerequisites: [],
        skillAssessment: {
          questions: [
            {
              question: 'What does HTML stand for?',
              options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
              correctAnswer: 0,
              difficulty: 'beginner'
            },
            {
              question: 'Which CSS property controls the text size?',
              options: ['font-style', 'text-size', 'font-size', 'text-style'],
              correctAnswer: 2,
              difficulty: 'beginner'
            },
            {
              question: 'How do you declare a variable in JavaScript?',
              options: ['variable carName;', 'v carName;', 'var carName;', 'declare carName;'],
              correctAnswer: 2,
              difficulty: 'beginner'
            }
          ],
          passingThreshold: 70,
          maxWrongAnswers: 3
        },
        modules: [
          {
            title: 'HTML Basics',
            description: 'Learn the fundamentals of HTML structure and elements',
            order: 1,
            difficulty: 'beginner',
            content: {
              theory: [
                { title: 'Introduction to HTML', duration: '30 min', type: 'video' },
                { title: 'HTML Document Structure', duration: '45 min', type: 'interactive' },
                { title: 'Common HTML Elements', duration: '60 min', type: 'practice' }
              ],
              practical: [
                { title: 'Build Your First Webpage', duration: '90 min', type: 'project' },
                { title: 'HTML Forms and Inputs', duration: '60 min', type: 'exercise' }
              ],
              assessments: [
                { title: 'HTML Quiz', type: 'quiz', questions: 10 },
                { title: 'Webpage Project', type: 'project', criteria: ['structure', 'semantics', 'accessibility'] }
              ]
            },
            adaptiveRules: {
              skipIf: 'user scores > 80% on pre-assessment',
              additionalResources: 'if user scores < 60% on assessment'
            }
          },
          {
            title: 'CSS Styling',
            description: 'Style your HTML with CSS to create beautiful web pages',
            order: 2,
            difficulty: 'beginner',
            content: {
              theory: [
                { title: 'CSS Introduction', duration: '30 min', type: 'video' },
                { title: 'Selectors and Properties', duration: '45 min', type: 'interactive' },
                { title: 'Box Model and Layout', duration: '60 min', type: 'practice' }
              ],
              practical: [
                { title: 'Style Your Webpage', duration: '90 min', type: 'project' },
                { title: 'Responsive Design Basics', duration: '60 min', type: 'exercise' }
              ],
              assessments: [
                { title: 'CSS Quiz', type: 'quiz', questions: 10 },
                { title: 'Styled Webpage Project', type: 'project', criteria: ['styling', 'layout', 'responsiveness'] }
              ]
            }
          },
          {
            title: 'JavaScript Fundamentals',
            description: 'Add interactivity to your web pages with JavaScript',
            order: 3,
            difficulty: 'intermediate',
            content: {
              theory: [
                { title: 'JavaScript Basics', duration: '45 min', type: 'video' },
                { title: 'Variables and Data Types', duration: '60 min', type: 'interactive' },
                { title: 'Functions and Control Flow', duration: '75 min', type: 'practice' }
              ],
              practical: [
                { title: 'Interactive Webpage', duration: '120 min', type: 'project' },
                { title: 'DOM Manipulation', duration: '90 min', type: 'exercise' }
              ],
              assessments: [
                { title: 'JavaScript Quiz', type: 'quiz', questions: 15 },
                { title: 'Interactive Project', type: 'project', criteria: ['functionality', 'code quality', 'user experience'] }
              ]
            }
          }
        ],
        realWorldScenarios: [
          {
            title: 'Build a Personal Portfolio',
            description: 'Create a professional portfolio website showcasing your skills',
            difficulty: 'intermediate',
            estimatedTime: '4-6 hours',
            requirements: ['HTML structure', 'CSS styling', 'JavaScript interactivity', 'Responsive design']
          },
          {
            title: 'E-commerce Landing Page',
            description: 'Design a product landing page for an online store',
            difficulty: 'intermediate',
            estimatedTime: '6-8 hours',
            requirements: ['Product showcase', 'Shopping cart functionality', 'Contact forms', 'Mobile optimization']
          }
        ],
        aiAssistance: {
          adaptiveQuizzes: true,
          personalizedFeedback: true,
          skillGapAnalysis: true,
          learningPathOptimization: true,
          realTimeHelp: true
        },
        progressTracking: {
          milestones: [
            { name: 'HTML Mastery', criteria: 'Complete HTML module with >80% score' },
            { name: 'CSS Proficiency', criteria: 'Complete CSS module with >80% score' },
            { name: 'JavaScript Basics', criteria: 'Complete JavaScript module with >80% score' },
            { name: 'Full Stack Project', criteria: 'Complete final project with all requirements' }
          ],
          skillMapping: {
            skills: [
              { name: 'HTML', targetLevel: 'Intermediate' },
              { name: 'CSS', targetLevel: 'Intermediate' },
              { name: 'JavaScript', targetLevel: 'Beginner' },
              { name: 'Web Design', targetLevel: 'Beginner' }
            ]
          }
        },
        integrations: {
          theOdinProject: {
            enabled: true,
            curriculumMapping: [
              { odinModule: 'HTML and CSS Basics', ourModule: 'HTML Basics' },
              { odinModule: 'CSS Layout and Positioning', ourModule: 'CSS Styling' },
              { odinModule: 'JavaScript Fundamentals', ourModule: 'JavaScript Fundamentals' }
            ]
          },
          otherPlatforms: ['freeCodeCamp', 'MDN Web Docs', 'W3Schools']
        },
        pricing: {
          isFree: true,
          price: { amount: 0, currency: 'USD', period: 'one-time' },
          features: ['Full course access', 'AI-powered feedback', 'Project portfolio', 'Certificate of completion']
        },
        isActive: true
      },
      {
        title: 'Advanced React Development',
        domain: 'Software Engineering',
        description: 'Master React.js with advanced patterns, state management, and performance optimization',
        difficulty: 'advanced',
        estimatedDuration: { weeks: 12, hoursPerWeek: 15 },
        prerequisites: [
          { skill: 'JavaScript', level: 'Intermediate' },
          { skill: 'HTML/CSS', level: 'Intermediate' }
        ],
        skillAssessment: {
          questions: [
            {
              question: 'What is the purpose of React hooks?',
              options: ['To create class components', 'To manage state and side effects in functional components', 'To style components', 'To handle routing'],
              correctAnswer: 1,
              difficulty: 'intermediate'
            },
            {
              question: 'Which hook should you use for side effects?',
              options: ['useState', 'useEffect', 'useContext', 'useReducer'],
              correctAnswer: 1,
              difficulty: 'intermediate'
            },
            {
              question: 'What is the virtual DOM?',
              options: ['A real DOM element', 'A lightweight copy of the real DOM', 'A styling framework', 'A database'],
              correctAnswer: 1,
              difficulty: 'intermediate'
            }
          ],
          passingThreshold: 80,
          maxWrongAnswers: 2
        },
        modules: [
          {
            title: 'React Fundamentals',
            description: 'Core React concepts and component architecture',
            order: 1,
            difficulty: 'intermediate',
            content: {
              theory: [
                { title: 'React Philosophy', duration: '45 min', type: 'video' },
                { title: 'Components and Props', duration: '60 min', type: 'interactive' },
                { title: 'State and Lifecycle', duration: '75 min', type: 'practice' }
              ],
              practical: [
                { title: 'Build a Todo App', duration: '120 min', type: 'project' },
                { title: 'Component Composition', duration: '90 min', type: 'exercise' }
              ],
              assessments: [
                { title: 'React Basics Quiz', type: 'quiz', questions: 15 },
                { title: 'Component Library', type: 'project', criteria: ['reusability', 'props', 'state management'] }
              ]
            }
          }
        ],
        realWorldScenarios: [
          {
            title: 'E-commerce Dashboard',
            description: 'Build a comprehensive admin dashboard for an online store',
            difficulty: 'advanced',
            estimatedTime: '20-30 hours',
            requirements: ['User management', 'Product catalog', 'Order processing', 'Analytics dashboard']
          }
        ],
        aiAssistance: {
          adaptiveQuizzes: true,
          personalizedFeedback: true,
          skillGapAnalysis: true,
          learningPathOptimization: true,
          realTimeHelp: true
        },
        progressTracking: {
          milestones: [
            { name: 'React Basics', criteria: 'Complete fundamentals module' },
            { name: 'State Management', criteria: 'Master Redux/Context API' },
            { name: 'Advanced Patterns', criteria: 'Implement advanced React patterns' },
            { name: 'Full Stack Project', criteria: 'Complete real-world project' }
          ]
        },
        pricing: {
          isFree: false,
          price: { amount: 99, currency: 'USD', period: 'one-time' },
          features: ['Advanced course access', '1-on-1 mentoring', 'Code reviews', 'Job placement assistance']
        },
        isActive: true
      }
    ];
    
    await LearningPath.insertMany(paths);
    console.log('Learning paths seeded successfully!');
  }
};

// Middleware to seed data on first request if needed
router.use(async (req, res, next) => {
  await seedLearningPaths();
  next();
});

// @route   GET /api/learning-paths
// @desc    Get all learning paths with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { domain, difficulty, search } = req.query;
    let query = { isActive: true };

    if (domain) {
      query.domain = domain;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const paths = await LearningPath.find(query)
      .select('title domain description difficulty estimatedDuration pricing isActive')
      .sort({ difficulty: 1, title: 1 });

    res.json(paths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/learning-paths/:id
// @desc    Get a single learning path by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id);
    if (!path) {
      return res.status(404).json({ message: 'Learning path not found' });
    }
    res.json(path);
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/learning-paths/:id/start
// @desc    Start a learning path for a user
// @access  Private
router.post('/:id/start', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user already has progress for this path
    let userProgress = await UserProgress.findOne({
      userId,
      learningPathId: id
    });

    if (userProgress) {
      return res.status(400).json({ message: 'You have already started this learning path' });
    }

    // Create new user progress
    userProgress = new UserProgress({
      userId,
      learningPathId: id,
      status: 'in_progress',
      startDate: new Date(),
      currentModule: { moduleIndex: 0, status: 'not_started' }
    });

    await userProgress.save();

    res.json({ 
      message: 'Learning path started successfully',
      userProgress 
    });
  } catch (error) {
    console.error('Error starting learning path:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/learning-paths/:id/assessment
// @desc    Take skill assessment for adaptive learning
// @access  Private
router.post('/:id/assessment', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, userExperience } = req.body;
    const userId = req.user.id;

    const learningPath = await LearningPath.findById(id);
    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    // Calculate assessment score
    let correctAnswers = 0;
    const totalQuestions = learningPath.skillAssessment.questions.length;

    answers.forEach((answer, index) => {
      if (answer === learningPath.skillAssessment.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / totalQuestions) * 100;
    const passed = score >= learningPath.skillAssessment.passingThreshold;

    // Determine recommended difficulty and modules to skip
    let recommendedDifficulty = learningPath.difficulty;
    let modulesToSkip = [];
    let aiRecommendations = [];

    if (passed && score > 80) {
      // User knows the basics, recommend intermediate/advanced
      if (learningPath.difficulty === 'beginner') {
        recommendedDifficulty = 'intermediate';
      }
      
      // Skip basic modules
      modulesToSkip = learningPath.modules
        .filter(module => module.difficulty === 'beginner')
        .map(module => module.order - 1);
    }

    // Generate AI recommendations using unified service
    try {
      const aiResponse = await unifiedAIService.generateCareerGuidance({
        userProfile: `Student with ${userExperience} experience`,
        currentSkills: `Scored ${score}% on ${learningPath.title} assessment`,
        goals: 'Improve skills and complete learning path',
        industry: learningPath.domain
      });
      
      aiRecommendations = aiResponse.recommendations;
    } catch (aiError) {
      console.error('AI service error:', aiError);
      aiRecommendations = ['Focus on practical projects', 'Join study groups', 'Practice regularly'];
    }

    // Update or create user progress
    let userProgress = await UserProgress.findOne({
      userId,
      learningPathId: id
    });

    if (!userProgress) {
      userProgress = new UserProgress({
        userId,
        learningPathId: id,
        status: 'in_progress',
        startDate: new Date()
      });
    }

    userProgress.skillAssessment = {
      completed: true,
      score,
      recommendedDifficulty,
      skillGaps: passed ? [] : ['Basic concepts need review'],
      aiRecommendations
    };

    userProgress.currentModule = {
      moduleIndex: modulesToSkip.length > 0 ? Math.max(...modulesToSkip) + 1 : 0,
      status: 'not_started',
      adaptiveDifficulty: recommendedDifficulty
    };

    await userProgress.save();

    res.json({
      score,
      passed,
      recommendedDifficulty,
      modulesToSkip,
      aiRecommendations,
      userProgress
    });

  } catch (error) {
    console.error('Error processing assessment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/learning-paths/:id/progress
// @desc    Get user progress for a learning path
// @access  Private
router.get('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const userProgress = await UserProgress.findOne({
      userId,
      learningPathId: id
    }).populate('learningPathId');

    if (!userProgress) {
      return res.status(404).json({ message: 'No progress found for this learning path' });
    }

    res.json(userProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/learning-paths/:id/progress
// @desc    Update user progress (complete module, update status, etc.)
// @access  Private
router.put('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { moduleIndex, status, completedModules, achievements } = req.body;
    const userId = req.user.id;

    const userProgress = await UserProgress.findOne({
      userId,
      learningPathId: id
    });

    if (!userProgress) {
      return res.status(404).json({ message: 'No progress found for this learning path' });
    }

    // Update progress
    if (moduleIndex !== undefined) {
      userProgress.currentModule.moduleIndex = moduleIndex;
    }

    if (status) {
      userProgress.currentModule.status = status;
    }

    if (completedModules) {
      userProgress.completedModules = completedModules;
    }

    if (achievements) {
      userProgress.achievements = achievements;
    }

    userProgress.lastUpdated = new Date();

    await userProgress.save();

    res.json({ message: 'Progress updated successfully', userProgress });
  } catch (error) {
    console.error('Error updating user progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/learning-paths/domains
// @desc    Get all unique learning path domains
// @access  Public
router.get('/domains', async (req, res) => {
  try {
    const domains = await LearningPath.distinct('domain');
    res.json(domains);
  } catch (error) {
    console.error('Error fetching learning path domains:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
