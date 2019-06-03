import * as path from 'path';
import { walk } from '../src/ls/walk';
import { compressFiles } from '../src/main';

(async () => {
    await compressDemo();
})();

async function compressGamehall() {
    const files = await getGamehallFiles();
    compressFiles(files);
}
async function compressDemo() {
    const files = await getDemoFiles();
    compressFiles(files);
}

async function compressBin() {
    const files = await getBinFiles();
    compressFiles(files);
}

async function getBinFiles() {
    const root_path = path.resolve(
        'C:\\Users\\zhangshiyang\\Desktop\\新建文件夹 (3)\\res'
    );
    const gamehall = path.resolve(root_path, 'bin');
    const res = path.resolve(gamehall, 'res');
    const assets = path.resolve(gamehall, 'assets');

    const wait_res = walk(res);
    const wait_assets = walk(assets);
    const files = await Promise.all([wait_res, wait_assets]).then(vals => {
        return vals[0].concat(vals[1]);
    });
    for (let len = files.length, i = len - 1; i >= 0; i--) {
        const ext = path.extname(files[i]);
        if (ext !== '.png' && ext !== '.jpg') {
            files.splice(i, 1);
        }
    }
    return files;
}
async function getGamehallFiles() {
    const root_path = path.resolve(
        'D:\\zsytssk\\job\\git\\gamehall\\www\\files\\game\\deepseaglory'
    );
    const res = path.resolve(root_path, 'res');
    const assets = path.resolve(root_path, 'assets');

    const wait_res = walk(res);
    const wait_assets = walk(assets);
    const files = await Promise.all([wait_res, wait_assets]).then(vals => {
        return vals[0].concat(vals[1]);
    });
    for (let len = files.length, i = len - 1; i >= 0; i--) {
        const ext = path.extname(files[i]);
        if (ext !== '.png' && ext !== '.jpg') {
            files.splice(i, 1);
        }
    }
    return files;
}
async function getDemoFiles() {
    return [
        'C:\\Users\\zhangshiyang\\Desktop\\test1\\res\\resurrection.png',
        // `D:/zsytssk/job/git/gamehall/www/files/game/deepseaglory/res/task.png`,
    ];
}
