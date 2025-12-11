import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Priority, Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent {
  @Input() editingTask: Task | null = null;
  @Output() submitTask = new EventEmitter<{ title: string; description: string; priority: Priority }>();
  @Output() cancel = new EventEmitter<void>();

  Priority = Priority;
  title = '';
  description = '';
  priority: Priority = Priority.MEDIUM;

  ngOnChanges() {
    if (this.editingTask) {
      this.title = this.editingTask.title;
      this.description = this.editingTask.description || '';
      this.priority = this.editingTask.priority;
    }
  }

  onSubmit() {
    if (this.title.trim()) {
      this.submitTask.emit({
        title: this.title.trim(),
        description: this.description.trim(),
        priority: this.priority
      });
      this.resetForm();
    }
  }

  onCancel() {
    this.resetForm();
    this.cancel.emit();
  }

  private resetForm() {
    this.title = '';
    this.description = '';
    this.priority = Priority.MEDIUM;
  }

  getPriorityLabel(priority: Priority): string {
    const labels = {
      [Priority.LOW]: 'Baja',
      [Priority.MEDIUM]: 'Media',
      [Priority.HIGH]: 'Alta',
      [Priority.URGENT]: 'Urgente'
    };
    return labels[priority];
  }
}
