import { S3File } from "./S3File";
import { Object } from "aws-sdk/clients/s3";
import { S3BaseContent } from "./S3BaseContent";
import { byString, byValue } from "sort-es";
import { FileInfo } from "./FileInfo";

export class S3FileGroup extends S3BaseContent {
  public FileName: string;
  public FileInfo: FileInfo;

  public Files: { extension: string; file: S3File }[];

  constructor(file: Object, siblings: Object[]) {
    super(file);

    this.FileName = this.Hierarchy[this.Hierarchy.length - 1];
    this.FileInfo = new FileInfo(this.FileName);

    this.Files = siblings.map((sibling) => {
      const file = new S3File(sibling);
      const { Extension } = file.FileInfo;

      return { extension: Extension, file };
    });
  }

  /**
   * group files by their file + extension
   * @param files
   */
  public static Create(fileInCurrentFolder: Object[]): S3FileGroup[] {
    const files = fileInCurrentFolder.map((file) => new S3File(file));

    const map = [] as { fileName: string; files: S3File[] }[];

    for (const file of files) {
      const { Name } = file.FileInfo;

      if (map.findIndex((f) => f.fileName === Name) === -1) {
        map.push({ fileName: Name, files: [] });
      }

      map.find((f) => f.fileName === Name)!.files.push(file);
    }

    return map
      .map((f) => new S3FileGroup(f.files[0].Object, f.files))
      .sort(byValue((x) => x.FileName, byString()));
  }
}