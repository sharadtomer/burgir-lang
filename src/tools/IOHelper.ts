import * as fs from "fs-extra";
import * as path from "path";

export class IOHelper {
    async getFilesInFolder(dirPath: string): Promise<string[]> {
        const files = await this._getAllFilesInFolder(dirPath);
        return files;
    }

    async getFileContent(fileLocation: string): Promise<string> {
        let data = await fs.readFile(fileLocation, {
            encoding: "utf-8",
        });
        // remove BOM(if present)
        if (data.charCodeAt(0) === 65279) {
            data = data.slice(1);
        }
        return data;
    }

    async writeFile(destinationPath: string, content: string) {
        const dirPath = path.dirname(destinationPath);
        await fs.ensureDir(dirPath);
        await fs.writeFile(destinationPath, content);
    }

    private async _getAllFilesInFolder(srcLocation: string): Promise<string[]> {
        const files: string[] = [];
        await this._findAndFillFiles(srcLocation, files);
        return files.map((filePath) => filePath.replace(srcLocation + "\\", ""));
    }

    // recusively find and fill nested file names in array
    private async _findAndFillFiles(srcLocation: string, files: string[]): Promise<void> {
        let dirContents = await fs.readdir(srcLocation);

        for (const name of dirContents) {
            let curLocation = path.resolve(srcLocation, name),
                stats = await fs.lstat(curLocation);

            if (stats.isDirectory()) {
                await this._findAndFillFiles(curLocation, files);
            } else {
                // it is a file, add to the samples array
                files.push(curLocation);
            }
        }
    }

    async mapFile(filePath: string, mapFn: (fileContent: string, filePath?: string) => string) {
      const content = await this.getFileContent(path.resolve(filePath));
      const transformedContent = mapFn(content, filePath);
      this.writeFile(path.resolve(filePath), transformedContent);
    }

    async mapFiles(filePaths: string[], mapFn: (fileContent: string, filePath?: string) => string) {
      for(let i = 0; i < filePaths.length; i++){
        await this.mapFile(filePaths[0], mapFn);
      }
    }
}
