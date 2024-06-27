/* eslint-disable no-lonely-if */
// eslint-disable-next-line max-classes-per-file

import { lesson } from "../entities/lesson/Lesson";
import { LessonRepository as Repository } from "../repositories/LessonRepository";

export class CreateLesson {
  private _repository: Repository;
  constructor(repository: Repository) {
    this._repository = repository;
  }
  async execute(
    payload: lesson,
    courseId: string,
    callback: any
  ): Promise<any> {
    const { title, summary, link, files, isPublic, fileVisibility, ownerId } =
      payload;
    const newPayload = {
      title,
      summary,
      files,
      videoURLs: link,
      isPublic,
      fileVisibility,
      ownerId: ownerId ? ownerId : "null",
    };
    return this._repository.createLesson(newPayload, courseId, callback);
  }
}

export class GetLessons {
  private _repository: Repository;
  constructor(repository: Repository) {
    this._repository = repository;
  }

  async execute(courseId: string, callback: any): Promise<any> {
    return this._repository.getLessons(courseId, callback);
  }
}

export class GetLessonsByCourseAndTutor {
  private _repository: Repository;
  constructor(repository: Repository) {
    this._repository = repository;
  }

  async execute(
    courseId: string,
    tutorId: string,
    callback: any
  ): Promise<any> {
    return this._repository.getLessonsByCourseAndTutor(
      courseId,
      tutorId,
      callback
    );
  }
}

export class GetAllIndividualTutorLessons {
  private _repository: Repository;
  constructor(repository: Repository) {
    this._repository = repository;
  }

  async execute(payload: any, callback: any): Promise<any> {
    return this._repository.getAllIndividualTutorLessons(payload, callback);
  }
}

export class GetVideoDuration {
  private _repository: Repository;
  constructor(repository: Repository) {
    this._repository = repository;
  }
  async execure(videoId: any): Promise<any> {
    return this._repository.getVideoDuration(videoId);
  }
}

export class EditLesson {
  private _repository: Repository;
  constructor(repository: Repository) {
    this._repository = repository;
  }
  async execute(
    payload: lesson,
    courseId: string,
    selectedLesson: any,
    callback: any
  ): Promise<any> {
    const newPayload: any = {
      title: payload.title,
      summary: payload.summary,
      isPublic: payload.isPublic,
      fileVisibility: payload.fileVisibility,
    };
    const updatedFile: any[] = [];
    if (selectedLesson.files.length > 0 && payload.files.length > 0) {
      payload.files.forEach((editFile: any) => {
        if (editFile.url) {
          if (selectedLesson.files.find((file: any) => file === editFile.url)) {
            updatedFile.push(editFile.url);
          }
        } else {
          updatedFile.push(editFile);
        }
      });
    } else {
      if (payload.files.length > 0) {
        payload.files.forEach((editFile: any) => {
          updatedFile.push(editFile);
        });
      }
    }

    newPayload["files"] = updatedFile;
    return this._repository.editLesson(
      newPayload,
      courseId,
      selectedLesson.id,
      callback
    );
  }
}

export class DeleteLesson {
  private _repository: Repository;
  constructor(repository: Repository) {
    this._repository = repository;
  }
  async execute(courseId: string, lessonId: string): Promise<any> {
    return this._repository.deleteLesson(courseId, lessonId);
  }
}

export class GetLessonById {
  private _repository: Repository;
  constructor(repository: Repository) {
    this._repository = repository;
  }

  async execute(courseId: string, lessonId: string): Promise<any> {
    return this._repository.getLessonById(courseId, lessonId);
  }
}
