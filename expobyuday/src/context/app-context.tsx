import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  group: string; // 'Office Project' | 'Personal Project' | 'Daily Study'
  startDate: string;
  endDate: string;
  progress: number; // 0 to 100
  tasksCount: number;
  color: string; // hex or name
}

export interface Task {
  id: string;
  title: string;
  projectName: string;
  group: string; // 'Office Project' | 'Personal Project' | 'Daily Study'
  time: string;
  status: 'To-do' | 'In Progress' | 'Done';
  date: string; // e.g. 'May 25'
}

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  addProject: (project: Omit<Project, 'id' | 'progress' | 'tasksCount' | 'color'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Grocery shopping app design',
    description: 'This application is designed for super shops. Customers will get a one-stop solution for their daily shopping.',
    group: 'Office Project',
    startDate: '01 May, 2022',
    endDate: '30 June, 2022',
    progress: 70,
    tasksCount: 23,
    color: '#007FFF',
  },
  {
    id: 'p2',
    name: 'Uber Eats redesign challange',
    description: 'Redesigning the food delivery app user flow and interface for better user engagement.',
    group: 'Personal Project',
    startDate: '10 May, 2022',
    endDate: '15 June, 2022',
    progress: 52,
    tasksCount: 30,
    color: '#FF6B35',
  },
  {
    id: 'p3',
    name: 'Daily Study',
    description: 'Preparing for technical assessments and daily reading of software design patterns.',
    group: 'Daily Study',
    startDate: '01 May, 2022',
    endDate: '31 May, 2022',
    progress: 87,
    tasksCount: 30,
    color: '#FF9F1C',
  },
];

const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Market Research',
    projectName: 'Grocery shopping app design',
    group: 'Office Project',
    time: '10:00 AM',
    status: 'Done',
    date: 'May 25',
  },
  {
    id: 't2',
    title: 'Competitive Analysis',
    projectName: 'Grocery shopping app design',
    group: 'Office Project',
    time: '12:00 PM',
    status: 'In Progress',
    date: 'May 25',
  },
  {
    id: 't3',
    title: 'Create Low-fidelity Wireframe',
    projectName: 'Uber Eats redesign challange',
    group: 'Personal Project',
    time: '07:00 PM',
    status: 'To-do',
    date: 'May 25',
  },
  {
    id: 't4',
    title: 'How to pitch a Design Sprint',
    projectName: 'Daily Study',
    group: 'Daily Study',
    time: '09:00 PM',
    status: 'To-do',
    date: 'May 25',
  },
  {
    id: 't5',
    title: 'Conduct User Interviews',
    projectName: 'Grocery shopping app design',
    group: 'Office Project',
    time: '11:00 AM',
    status: 'Done',
    date: 'May 24',
  },
  {
    id: 't6',
    title: 'Review Competitor Apps',
    projectName: 'Uber Eats redesign challange',
    group: 'Personal Project',
    time: '03:00 PM',
    status: 'Done',
    date: 'May 26',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addProject = (newProj: Omit<Project, 'id' | 'progress' | 'tasksCount' | 'color'>) => {
    // Generate a new project object
    const colorMap: Record<string, string> = {
      'Office Project': '#007FFF',
      'Personal Project': '#FF6B35',
      'Daily Study': '#FF9F1C',
    };

    const project: Project = {
      ...newProj,
      id: `p-${Date.now()}`,
      progress: 0,
      tasksCount: 0,
      color: colorMap[newProj.group] || '#5C3BFF',
    };

    setProjects((prev) => [project, ...prev]);

    // Also auto-add a default task for this project
    const defaultTask: Task = {
      id: `t-${Date.now()}`,
      title: `Kickoff: ${project.name}`,
      projectName: project.name,
      group: project.group as any,
      time: '10:00 AM',
      status: 'To-do',
      date: 'May 25',
    };
    setTasks((prev) => [defaultTask, ...prev]);
  };

  const addTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `t-${Date.now()}`,
    };
    setTasks((prev) => [task, ...prev]);

    // Update tasksCount for the matching project
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.name === newTask.projectName
          ? { ...proj, tasksCount: proj.tasksCount + 1 }
          : proj
      )
    );
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task))
    );

    // Recompute project progress based on tasks
    // Finding the task details
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    setProjects((prevProjects) =>
      prevProjects.map((proj) => {
        if (proj.name === targetTask.projectName) {
          // Find all tasks for this project
          const projectTasks = tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t
          ).filter((t) => t.projectName === proj.name);

          const completed = projectTasks.filter((t) => t.status === 'Done').length;
          const total = projectTasks.length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
          return { ...proj, progress };
        }
        return proj;
      })
    );
  };

  return (
    <AppContext.Provider value={{ projects, tasks, addProject, addTask, updateTaskStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
