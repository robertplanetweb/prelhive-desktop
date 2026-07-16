import fs from 'fs-extra';

export default async () => {
    await fs.unlink('dist/win-unpacked/resources/database/database.sqlite');
}
