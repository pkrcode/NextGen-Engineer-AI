const express = require('express');
const router = express.Router();
const CareerRole = require('../models/CareerRole');

// Auto-seed data if no roles exist (for development/demo)
const seedCareerRoles = async () => {
  const count = await CareerRole.countDocuments();
  if (count === 0) {
    console.log('Seeding initial career roles data...');
    const roles = [
      {
        title: 'AI/ML Engineer',
        domain: 'Software Engineering',
        description: 'Designs, develops, and deploys AI and machine learning models and systems.',
        lead: 'Focuses on building intelligent systems that learn from data.',
        requiredSkills: [{ name: 'Python', level: 'Advanced' }, { name: 'TensorFlow/PyTorch', level: 'Intermediate' }, { name: 'Machine Learning Algorithms', level: 'Advanced' }],
        averageSalary: 130000,
        salaryBands: [{ location: 'USA', min: 100000, max: 180000 }],
        demandIndex: 95,
        isFeatured: true,
        tags: ['AI', 'Machine Learning', 'Deep Learning', 'Python', 'Data Science']
      },
      {
        title: 'Data Scientist',
        domain: 'Data Science',
        description: 'Analyzes complex data to extract insights and inform business decisions.',
        lead: 'Combines statistics, computer science, and domain expertise.',
        requiredSkills: [{ name: 'Python/R', level: 'Advanced' }, { name: 'SQL', level: 'Advanced' }, { name: 'Statistics', level: 'Advanced' }],
        averageSalary: 120000,
        salaryBands: [{ location: 'USA', min: 90000, max: 160000 }],
        demandIndex: 90,
        isFeatured: true,
        tags: ['Data Analysis', 'Statistics', 'Modeling', 'SQL', 'Big Data']
      },
      {
        title: 'Cybersecurity Analyst',
        domain: 'Cybersecurity',
        description: 'Protects computer systems and networks from cyber threats.',
        lead: 'Identifies vulnerabilities and implements security measures.',
        requiredSkills: [{ name: 'Network Security', level: 'Intermediate' }, { name: 'Incident Response', level: 'Intermediate' }, { name: 'Linux', level: 'Beginner' }],
        averageSalary: 100000,
        salaryBands: [{ location: 'USA', min: 80000, max: 140000 }],
        demandIndex: 85,
        tags: ['Security', 'Network', 'Threat Detection', 'Compliance']
      },
      {
        title: 'Robotics Engineer',
        domain: 'Mechanical Engineering',
        description: 'Designs, builds, and maintains robots and robotic systems.',
        lead: 'Integrates mechanical, electrical, and software components.',
        requiredSkills: [{ name: 'CAD Software', level: 'Intermediate' }, { name: 'Control Systems', level: 'Intermediate' }, { name: 'C++', level: 'Beginner' }],
        averageSalary: 110000,
        salaryBands: [{ location: 'USA', min: 85000, max: 150000 }],
        demandIndex: 80,
        tags: ['Robotics', 'Automation', 'Mechatronics', 'Embedded Systems']
      },
      {
        title: 'Full Stack Developer',
        domain: 'Software Engineering',
        description: 'Develops both front-end and back-end components of web applications.',
        lead: 'Proficient in multiple programming languages and frameworks.',
        requiredSkills: [{ name: 'JavaScript', level: 'Advanced' }, { name: 'React/Angular/Vue', level: 'Intermediate' }, { name: 'Node.js/Python/Java', level: 'Intermediate' }, { name: 'Databases', level: 'Intermediate' }],
        averageSalary: 115000,
        salaryBands: [{ location: 'USA', min: 90000, max: 150000 }],
        demandIndex: 92,
        tags: ['Web Development', 'Frontend', 'Backend', 'JavaScript', 'Cloud']
      },
      {
        title: 'Aerospace Engineer',
        domain: 'Aerospace Engineering',
        description: 'Designs, develops, and tests aircraft, spacecraft, and missiles.',
        lead: 'Applies principles of aerodynamics, propulsion, and structural mechanics.',
        requiredSkills: [{ name: 'Aerodynamics', level: 'Intermediate' }, { name: 'Thermodynamics', level: 'Intermediate' }, { name: 'MATLAB', level: 'Beginner' }],
        averageSalary: 105000,
        salaryBands: [{ location: 'USA', min: 80000, max: 140000 }],
        demandIndex: 75,
        tags: ['Aircraft', 'Spacecraft', 'Design', 'Propulsion']
      }
    ];
    await CareerRole.insertMany(roles);
    console.log('Career roles seeded successfully!');
  }
};

// Middleware to seed data on first request if needed
router.use(async (req, res, next) => {
  await seedCareerRoles();
  next();
});

// @route   GET /api/careers/roles
// @desc    Get all career roles, with optional domain and search query
// @access  Public
router.get('/roles', async (req, res) => {
  try {
    const { domain, q } = req.query;
    let query = {};

    if (domain) {
      query.domain = domain;
    }

    if (q) {
      // Use text search if a query is provided
      query.$text = { $search: q };
    }

    const roles = await CareerRole.find(query).sort({ demandIndex: -1 });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching career roles:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/careers/roles/:id
// @desc    Get a single career role by ID
// @access  Public
router.get('/roles/:id', async (req, res) => {
  try {
    const role = await CareerRole.findById(req.params.id).populate('relatedRoadmaps');
    if (!role) {
      return res.status(404).json({ message: 'Career role not found' });
    }
    res.json(role);
  } catch (error) {
    console.error('Error fetching career role by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/careers/domains
// @desc    Get all unique career domains
// @access  Public
router.get('/domains', async (req, res) => {
  try {
    const domains = await CareerRole.distinct('domain');
    res.json(domains);
  } catch (error) {
    console.error('Error fetching career domains:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/careers/reset
// @desc    Clear all career roles and re-seed (development only)
// @access  Public
router.delete('/reset', async (req, res) => {
  try {
    await CareerRole.deleteMany({});
    await seedCareerRoles();
    res.json({ message: 'Career roles reset and re-seeded successfully' });
  } catch (error) {
    console.error('Error resetting career roles:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add more routes as needed (e.g., POST for creating roles, PUT for updating, DELETE)
// These would typically require admin authentication
// router.post('/roles', authMiddleware, async (req, res) => { ... });

module.exports = router;


