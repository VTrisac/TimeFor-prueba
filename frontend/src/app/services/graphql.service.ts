import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '../models/task.model';

const TASK_FRAGMENT = gql`
  fragment TaskFields on Task {
    id
    title
    description
    status
    priority
    createdAt
    updatedAt
  }
`;

const GET_TASKS = gql`
  ${TASK_FRAGMENT}
  query GetTasks($status: TaskStatus) {
    tasks(status: $status) {
      ...TaskFields
    }
  }
`;

const CREATE_TASK = gql`
  ${TASK_FRAGMENT}
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFields
    }
  }
`;

const UPDATE_TASK = gql`
  ${TASK_FRAGMENT}
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      ...TaskFields
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  constructor(private apollo: Apollo) {}

  getTasks(status?: TaskStatus): Observable<Task[]> {
    return this.apollo
      .watchQuery<{ tasks: Task[] }>({
        query: GET_TASKS,
        variables: { status },
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(map(result => result.data.tasks));
  }

  createTask(input: CreateTaskInput): Observable<Task> {
    return this.apollo
      .mutate<{ createTask: Task }>({
        mutation: CREATE_TASK,
        variables: { input },
        refetchQueries: [{ query: GET_TASKS }]
      })
      .pipe(map(result => result.data!.createTask));
  }

  updateTask(id: string, input: UpdateTaskInput): Observable<Task> {
    return this.apollo
      .mutate<{ updateTask: Task }>({
        mutation: UPDATE_TASK,
        variables: { id, input },
        refetchQueries: [{ query: GET_TASKS }]
      })
      .pipe(map(result => result.data!.updateTask));
  }

  deleteTask(id: string): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteTask: boolean }>({
        mutation: DELETE_TASK,
        variables: { id },
        refetchQueries: [{ query: GET_TASKS }]
      })
      .pipe(map(result => result.data!.deleteTask));
  }
}
