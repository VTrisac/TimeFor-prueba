import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus, Priority } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() statusChange = new EventEmitter<TaskStatus>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  TaskStatus = TaskStatus;
  showActions = false;

  getPriorityConfig(priority: Priority) {
    const configs = {
      [Priority.LOW]: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Baja' },
      [Priority.MEDIUM]: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Media' },
      [Priority.HIGH]: { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Alta' },
      [Priority.URGENT]: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Urgente' }
    };
    return configs[priority];
  }

  getStatusConfig(status: TaskStatus) {
    const configs = {
      [TaskStatus.PENDING]: { icon: '⏳', label: 'Pendiente', color: 'text-slate-600' },
      [TaskStatus.IN_PROGRESS]: { icon: '🚀', label: 'En progreso', color: 'text-primary-600' },
      [TaskStatus.COMPLETED]: { icon: '✓', label: 'Completada', color: 'text-green-600' }
    };
    return configs[status];
  }

  onStatusChange(newStatus: TaskStatus) {
    this.statusChange.emit(newStatus);
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}
