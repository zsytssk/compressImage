import * as path from 'path';
import { cp } from '../src/ls/main';

const files = ['dist/compressImg.js', 'src/config.json'];
const target_folder = 'D:\\zsytssk\\job\\HonorLite\\demo\\script\\compressImg';

for (const file of files) {
    const filename = path.basename(file);
    const dist = path.resolve(target_folder, filename);
    cp(file, dist);
}
