// src/data/templates.js
export const projectTemplates = [
  {
    id: 'thesis',
    title: 'University Thesis',
    description: 'A structured plan for writing a research thesis or dissertation.',
    icon: '📚',
    tasks: [
      { text: 'Finalize Research Question and Proposal', subtasks: ['Meet with advisor', 'Submit proposal'] },
      { text: 'Conduct Literature Review', subtasks: ['Gather 50 sources', 'Write annotated bibliography', 'Synthesize findings'] },
      { text: 'Develop Methodology', subtasks: [] },
      { text: 'Data Collection & Analysis', subtasks: [] },
      { text: 'Write First Draft', subtasks: ['Draft Chapter 1: Introduction', 'Draft Chapter 2: Lit Review', 'Draft Chapter 3: Methodology'] },
      { text: 'Review and Edit', subtasks: ['Submit for advisor feedback', 'Proofread for grammar and spelling'] },
      { text: 'Final Submission and Defense Prep', subtasks: [] },
    ],
  },
  {
    id: 'exam-prep',
    title: 'Exam Preparation Plan',
    description: 'A 4-week study schedule to prepare for a major exam.',
    icon: '✍️',
    tasks: [
      { text: 'Week 1: Review Chapters 1-3', subtasks: ['Read chapter summaries', 'Complete practice problems'] },
      { text: 'Week 2: Review Chapters 4-6', subtasks: ['Attend review session', 'Create flashcards'] },
      { text: 'Week 3: Full Practice Exams', subtasks: ['Take Practice Exam A', 'Review incorrect answers'] },
      { text: 'Week 4: Final Review & Rest', subtasks: ['Review all flashcards', "Get a good night's sleep"] },
    ],
  },
  {
    id: 'youtube-video',
    title: 'YouTube Video Production',
    description: 'A complete workflow for creating and publishing a video.',
    icon: '🎬',
    tasks: [
      { text: 'Brainstorming and Scripting', subtasks: ['Research topic', 'Write script draft 1', 'Finalize script'] },
      { text: 'Filming', subtasks: ['Set up lighting and camera', 'Record A-roll', 'Record B-roll'] },
      { text: 'Editing', subtasks: ['Assemble rough cut', 'Add music and sound effects', 'Color grade footage'] },
      { text: 'Publishing', subtasks: ['Create thumbnail', 'Write title and description', 'Upload and schedule'] },
    ],
  },
];
