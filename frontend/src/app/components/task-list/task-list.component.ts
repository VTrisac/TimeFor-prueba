import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphQLService } from '../../services/graphql.service';
import { Task, TaskStatus, Priority, UpdateTaskInput } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, TaskFormComponent],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  showForm = false;
  editingTask: Task | null = null;
  currentFilter: TaskStatus | 'ALL' = 'ALL';
  loading = false;
  error: string | null = null;

  TaskStatus = TaskStatus;

  constructor(private graphQLService: GraphQLService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks(status?: TaskStatus) {
    this.loading = true;
    this.error = null;

    this.graphQLService.getTasks(status).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las tareas. Por favor, verifica la conexión.';
        this.loading = false;
        console.error('Error loading tasks:', error);
      }
    });
  }

  onCreateTask(data: { title: string; description: string; priority: Priority }) {
    this.graphQLService.createTask({
      title: data.title,
      description: data.description || undefined,
      priority: data.priority
    }).subscribe({
      next: () => {
        this.showForm = false;
        this.loadTasks();
      },
      error: (error) => {
        this.error = 'Error al crear la tarea';
        console.error('Error creating task:', error);
      }
    });
  }

  onEditTask(task: Task) {
    this.editingTask = task;
    this.showForm = true;
  }

  onUpdateTask(data: { title: string; description: string; priority: Priority }) {
    if (!this.editingTask) return;

    const updates: UpdateTaskInput = {
      title: data.title,
      description: data.description || undefined,
      priority: data.priority
    };

    this.graphQLService.updateTask(this.editingTask.id, updates).subscribe({
      next: () => {
        this.showForm = false;
        this.editingTask = null;
        this.loadTasks();
      },
      error: (error) => {
        this.error = 'Error al actualizar la tarea';
        console.error('Error updating task:', error);
      }
    });
  }

  onStatusChange(task: Task, newStatus: TaskStatus) {
    this.graphQLService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => this.loadTasks(),
      error: (error) => {
        this.error = 'Error al actualizar el estado';
        console.error('Error updating status:', error);
      }
    });
  }

  onDeleteTask(task: Task) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${task.title}"?`)) {
      this.graphQLService.deleteTask(task.id).subscribe({
        next: () => this.loadTasks(),
        error: (error) => {
          this.error = 'Error al eliminar la tarea';
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  onCancelForm() {
    this.showForm = false;
    this.editingTask = null;
  }

  setFilter(filter: TaskStatus | 'ALL') {
    this.currentFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.currentFilter === 'ALL') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === this.currentFilter);
    }
  }

  getTaskCountByStatus(status: TaskStatus): number {
    return this.tasks.filter(task => task.status === status).length;
  }
}
