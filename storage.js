// Utility for localStorage CRUD for projects and tasks
const STORAGE_KEY = 'exectrack_projects';

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadProjects() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function addProject(project) {
  const projects = loadProjects();
  projects.push(project);
  saveProjects(projects);
}

export function updateProject(updatedProject) {
  const projects = loadProjects();
  const idx = projects.findIndex(p => p.projectId === updatedProject.projectId);
  if (idx !== -1) {
    projects[idx] = updatedProject;
    saveProjects(projects);
  }
}

export function addTaskToWeek(projectId, weekLabel, task) {
  const projects = loadProjects();
  const project = projects.find(p => p.projectId === projectId);
  if (project) {
    const week = project.weeks.find(w => w.weekLabel === weekLabel);
    if (week) {
      week.tasks.push(task);
      saveProjects(projects);
    }
  }
}

export function updateTaskStatus(projectId, weekLabel, taskTitle, newStatus) {
  const projects = loadProjects();
  const project = projects.find(p => p.projectId === projectId);
  if (project) {
    const week = project.weeks.find(w => w.weekLabel === weekLabel);
    if (week) {
      const task = week.tasks.find(t => t.title === taskTitle);
      if (task) {
        task.status = newStatus;
        saveProjects(projects);
      }
    }
  }
}

export function deleteTaskFromWeek(projectId, weekLabel, taskTitle) {
  const projects = loadProjects();
  const project = projects.find(p => p.projectId === projectId);
  if (project) {
    const week = project.weeks.find(w => w.weekLabel === weekLabel);
    if (week) {
      week.tasks = week.tasks.filter(t => t.title !== taskTitle);
      saveProjects(projects);
    }
  }
}

export function autoUpdateTaskStatuses(todayStr) {
  const projects = loadProjects();
  let changed = false;
  projects.forEach(project => {
    project.weeks.forEach(week => {
      week.tasks.forEach(task => {
        if (task.status !== 'Complete') {
          if (task.dueDate && new Date(task.dueDate) < new Date(todayStr)) {
            if (task.status !== 'Delayed') {
              task.status = 'Delayed';
              changed = true;
            }
          } else {
            if (task.status !== 'In Progress') {
              task.status = 'In Progress';
              changed = true;
            }
          }
        }
      });
    });
  });
  if (changed) saveProjects(projects);
}
