import * as imagemin from 'imagemin';
import * as imageminMozJpeg from 'imagemin-mozjpeg';
import * as imageminPngquant from 'imagemin-pngquant';
import * as path from 'path';
import { SRC, intConfig } from './const';
import { lstat } from './ls/asyncUtil';
import { walk } from './ls/walk';
import { write } from './ls/write';
import { pMap } from './pMap';

const config_path = path.resolve(
    path.dirname(process.argv[1]),
    './config.json'
);
const [type, ...files] = process.argv.slice(2);
async function main() {
    await intConfig(config_path);
    if (type !== 'compressImg') {
        return;
    }
    if (files.length) {
        compressFiles(files);
    } else {
        const file_list = await getAllFiles();
        compressFiles(file_list);
    }
}
main();

export async function compressFiles(file_list: string[]) {
    const start = Date.now();
    console.log(file_list);
    let i = 0;
    const all_num = file_list.length;
    const mapper = async file => {
        const result = await compressImg(file);
        i++;
        if (!result) {
            console.log(`${i}/${all_num}:>`, file, 'no compress');
            return;
        }

        console.log(`${i}/${all_num}:>`, file, `${result}%`);
    };

    await pMap(file_list, mapper, { concurrency: 6 });
    console.log('completed:>', Date.now() - start);
}

export async function getAllFiles() {
    const res = path.resolve(SRC, 'res');
    const assets = path.resolve(SRC, 'assets');
    const wait_res = walk(res);
    const wait_assets = walk(assets);
    const file_list = await Promise.all([wait_res, wait_assets]).then(
        item_list => {
            return item_list[0].concat(item_list[1]);
        }
    );
    for (let len = file_list.length, i = len - 1; i >= 0; i--) {
        const ext = path.extname(file_list[i]);
        if (ext !== '.png' && ext !== '.jpg') {
            file_list.splice(i, 1);
        }
    }
    return file_list;
}

export function calcPercent(new_val, ori_val) {
    return Math.floor((new_val / ori_val) * 100);
}

/** data 转到文件后自动增加的大小 */
export async function compressImg(file) {
    const { size } = await lstat(file);
    const ext = path.extname(file);
    let data;
    if (ext === '.png') {
        data = await compressPng(file);
    } else {
        data = await compressJpg(file);
    }
    if (!data) {
        return false;
    }
    const size_percent = calcPercent(data.toString().length, size * 0.9);

    /** 比原始更大不作处理 */
    if (size_percent >= 100) {
        return false;
    }
    await write(file, data);
    return size_percent;
}

async function compressPng(file) {
    try {
        const data = await imagemin([file], undefined, {
            plugins: [imageminPngquant()],
        });
        return data[0].data;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function compressJpg(file) {
    try {
        const data = await imagemin([file], undefined, {
            plugins: [imageminMozJpeg()],
        });
        return data[0].data;
    } catch (err) {
        console.error(err);
        return false;
    }
}
