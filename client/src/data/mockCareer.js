export const mockDomains = [
  'AI/ML',
  'Cloud',
  'Cybersecurity',
  'Data',
  'Web Development',
  'DevOps'
];

export const mockRoles = [
  {
    _id: 'ml-eng',
    title: 'Machine Learning Engineer',
    domain: 'AI/ML',
    lead: 'Build, train, and deploy ML models with MLOps best practices.',
    description: 'Own end-to-end ML lifecycle: data pipelines, feature stores, training, deployment.',
    demandIndex: 92,
    isFeatured: true,
    salaryBands: [{ location: 'IN', min: 1800000, max: 4000000 }],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'SQL']
  },
  {
    _id: 'cloud-arch',
    title: 'Cloud Solutions Architect',
    domain: 'Cloud',
    lead: 'Design scalable, secure architectures on AWS/GCP/Azure.',
    description: 'Focus on IAM, VPC, CI/CD, IaC (Terraform), Kubernetes, and cost optimization.',
    demandIndex: 88,
    isFeatured: false,
    salaryBands: [{ location: 'IN', min: 2200000, max: 4500000 }],
    skills: ['AWS', 'Terraform', 'Kubernetes', 'Networking']
  },
  {
    _id: 'sec-analyst',
    title: 'Security Analyst',
    domain: 'Cybersecurity',
    lead: 'Monitor, detect, and respond to security threats.',
    description: 'Operate SIEM, investigate alerts, threat hunt, and automate playbooks.',
    demandIndex: 81,
    isFeatured: false,
    salaryBands: [{ location: 'IN', min: 1200000, max: 2800000 }],
    skills: ['SIEM', 'Threat Intel', 'Splunk', 'Python']
  },
  {
    _id: 'data-analyst',
    title: 'Data Analyst',
    domain: 'Data',
    lead: 'Transform data into insights and dashboards for decisions.',
    description: 'SQL, Excel, Python, and BI tools to analyze and visualize business data.',
    demandIndex: 76,
    isFeatured: false,
    salaryBands: [{ location: 'IN', min: 800000, max: 1800000 }],
    skills: ['SQL', 'Python', 'Power BI', 'Tableau']
  },
  {
    _id: 'fullstack-dev',
    title: 'Full-Stack Developer',
    domain: 'Web Development',
    lead: 'Build modern web apps with React, Node.js, and MongoDB.',
    description: 'Frontend + backend development, REST APIs, auth, and deployments.',
    demandIndex: 85,
    isFeatured: true,
    salaryBands: [{ location: 'IN', min: 1000000, max: 2400000 }],
    skills: ['React', 'Node.js', 'Express', 'MongoDB']
  }
];


