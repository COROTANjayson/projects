export class lesson {
  courseId: string | null | undefined;

  title: string;

  summary: string;

  files: [];

  link: [];

  isPublic: boolean;

  fileVisibility: boolean;

  ownerId: string;

  constructor(
    courseId: string | null | undefined,
    title: string,
    summary: string,
    files: [],
    link: [],
    isPublic: boolean,
    fileVisibility: boolean,
    ownerId: string
  ) {
    this.courseId = courseId;
    this.title = title;
    this.summary = summary;
    this.files = files;
    this.link = link;
    this.isPublic = isPublic;
    this.fileVisibility = fileVisibility;
    this.ownerId = ownerId ? ownerId : "";
  }
}
