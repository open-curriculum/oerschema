/**
 * Pre-built course outline templates
 */

import { OutlineNode, createNode } from "./outline-types";

/**
 * Generate a week-based course outline
 */
export function createWeeklyOutlineTemplate(weeks: number, courseName?: string): OutlineNode {
  const course = createNode('Course', {
    name: courseName || `${weeks}-Week Course`,
    courseIdentifier: 'COURSE-101',
    department: 'Your Department',
    institution: 'Your Institution',
    termOffered: 'Fall 2025',
  });

  // Create modules/units based on logical groupings
  const modulesPerCourse = Math.ceil(weeks / 3); // Roughly 3 weeks per module
  
  for (let moduleNum = 1; moduleNum <= modulesPerCourse; moduleNum++) {
    const weeksInModule = Math.min(3, weeks - (moduleNum - 1) * 3);
    if (weeksInModule <= 0) break;
    
    const module = createNode('Module', {
      name: `Module ${moduleNum}`,
      description: `Weeks ${(moduleNum - 1) * 3 + 1}-${(moduleNum - 1) * 3 + weeksInModule}`,
    });

    // Add learning objective for the module
    const moduleObjective = createNode('LearningObjective', {
      name: `Module ${moduleNum} Learning Objective`,
      skill: 'Core competency for this module',
    });
    module.children.push(moduleObjective);

    // Create units (weeks) within the module
    for (let weekNum = 1; weekNum <= weeksInModule; weekNum++) {
      const globalWeek = (moduleNum - 1) * 3 + weekNum;
      const unit = createNode('Unit', {
        name: `Week ${globalWeek}`,
        description: `Weekly content and activities`,
      });

      // Add topic for the week
      const topic = createNode('Topic', {
        name: `Week ${globalWeek} Topic`,
      });
      unit.children.push(topic);

      // Add 2-3 lessons per week
      const lessonsPerWeek = weekNum % 2 === 0 ? 3 : 2;
      for (let lessonNum = 1; lessonNum <= lessonsPerWeek; lessonNum++) {
        const lesson = createNode('Lesson', {
          name: `Week ${globalWeek} - Lesson ${lessonNum}`,
        });

        // Add learning objective to lesson
        const lessonObjective = createNode('LearningObjective', {
          name: `Lesson ${lessonNum} Objective`,
          skill: 'Specific skill for this lesson',
        });
        lesson.children.push(lessonObjective);

        // Add a practice activity
        const practice = createNode('Practice', {
          name: `Practice Activity ${lessonNum}`,
          actionTypes: ['Reading', 'Reflecting'],
        });
        lesson.children.push(practice);

        unit.children.push(lesson);
      }

      // Add weekly assessment (every other week)
      if (weekNum % 2 === 0 || weekNum === weeksInModule) {
        const quiz = createNode('Quiz', {
          name: `Week ${globalWeek} Quiz`,
          gradingFormat: 'Points',
          points: 10,
        });
        unit.children.push(quiz);
      }

      module.children.push(unit);
    }

    // Add module project at the end of module
    const project = createNode('Project', {
      name: `Module ${moduleNum} Project`,
      description: 'Demonstrate mastery of module concepts',
      gradingFormat: 'Points',
      points: 100,
    });
    
    const projectAssessment = createNode('Assessment', {
      name: `Module ${moduleNum} Project Assessment`,
      gradingFormat: 'Points',
      points: 100,
    });
    project.children.push(projectAssessment);
    
    module.children.push(project);
    course.children.push(module);
  }

  // Add final exam
  const finalExam = createNode('Assessment', {
    name: 'Final Examination',
    gradingFormat: 'Points',
    points: 200,
  });
  course.children.push(finalExam);

  return course;
}

/**
 * Generate a 4-week intensive course
 */
export function create4WeekTemplate(): OutlineNode {
  return createWeeklyOutlineTemplate(4, '4-Week Intensive Course');
}

/**
 * Generate a 6-week course
 */
export function create6WeekTemplate(): OutlineNode {
  return createWeeklyOutlineTemplate(6, '6-Week Course');
}

/**
 * Generate an 8-week course
 */
export function create8WeekTemplate(): OutlineNode {
  return createWeeklyOutlineTemplate(8, '8-Week Course');
}

/**
 * Generate a 12-week course (quarter system)
 */
export function create12WeekTemplate(): OutlineNode {
  return createWeeklyOutlineTemplate(12, '12-Week Course (Quarter)');
}

/**
 * Generate a 15-week course (semester system)
 */
export function create15WeekTemplate(): OutlineNode {
  return createWeeklyOutlineTemplate(15, '15-Week Course (Semester)');
}

/**
 * Get all available templates
 */
export const courseTemplates = [
  {
    id: '4-week',
    name: '4-Week Intensive',
    description: 'Fast-paced 4-week course with 2 modules',
    generator: create4WeekTemplate,
  },
  {
    id: '6-week',
    name: '6-Week Course',
    description: 'Short course with 2 modules over 6 weeks',
    generator: create6WeekTemplate,
  },
  {
    id: '8-week',
    name: '8-Week Course',
    description: 'Standard 8-week course with 3 modules',
    generator: create8WeekTemplate,
  },
  {
    id: '12-week',
    name: '12-Week (Quarter)',
    description: 'Quarter system course with 4 modules',
    generator: create12WeekTemplate,
  },
  {
    id: '15-week',
    name: '15-Week (Semester)',
    description: 'Full semester course with 5 modules',
    generator: create15WeekTemplate,
  },
] as const;
