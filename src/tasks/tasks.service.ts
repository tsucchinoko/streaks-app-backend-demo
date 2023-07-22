import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponse } from './types/task';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateTaskDto): Promise<string> {
    const id = uuid();

    try {
      const result = await this.prisma.task.create({
        data: {
          id,
          title: payload.title
        }
      });

      return `created a new task: ${result.id}`;
    } catch (error) {
      console.log(error);
      return `failed to create a task: ${error}`;
    }
  }

  async findAll(): Promise<TaskResponse[] | string> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          isDeleted: false
        },
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          _count: {
            select: {
              taskManagements: true
            }
          }
        }
      });
      const result: TaskResponse[] = tasks.map((task) => {
        return {
          id: task.id,
          title: task.title,
          completedCount: task._count.taskManagements
        };
      });
      return result;
    } catch (error) {
      console.log(error);
      return `failed to find all tasks: ${error}`;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: string, payload: UpdateTaskDto): Promise<string> {
    try {
      const result = await this.prisma.task.update({
        where: {
          id
        },
        data: {
          ...payload
        }
      });
      return `updated a task: ${result.id}`;
    } catch (error) {
      console.log(error);
      return `failed to update task: ${error}`;
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const result = await this.prisma.task.update({
        where: {
          id
        },
        data: {
          isDeleted: true
        }
      });
      return `deleted a task: ${result.id}`;
    } catch (error) {
      console.log(error);
      return `failed to delete task: ${error}`;
    }
  }
}
